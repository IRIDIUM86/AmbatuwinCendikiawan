"""
CRUD API Server - Standalone Flask service for auth, profiles, events, and AI proposals.

Runs on port 5001 (separate from the matching backend on 5000) so the original
backend is left untouched. Talks to Supabase via REST and reuses the existing
BedrockLLMService for proposal generation.
"""
import os
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from llm_service import BedrockLLMService
from config import BEDROCK_MODEL_ID

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SUPABASE_URL = (os.getenv("supabaseUrl") or "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("supabaseAnonPublic") or os.getenv("supabaseKey")
SUPABASE_SERVICE_KEY = os.getenv("supabaseSecret") or SUPABASE_ANON_KEY

if not SUPABASE_URL:
    raise RuntimeError("supabaseUrl env var is required")

REST_URL = f"{SUPABASE_URL}/rest/v1"
AUTH_URL = f"{SUPABASE_URL}/auth/v1"


def _anon_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
    }


def _service_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


# ---------------------------------------------------------------------------
# App + LLM service
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

llm_service = BedrockLLMService(
    region=os.getenv("AWS_REGION"),
    access_key=os.getenv("AWS_ACCESS_KEY_ID"),
    secret_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    model_id=BEDROCK_MODEL_ID,
)


def _ok(data: Any = None, **extra) -> Any:
    payload = {"success": True}
    if data is not None:
        payload["data"] = data
    payload.update(extra)
    return jsonify(payload)


def _err(message: str, status: int = 400) -> Any:
    return jsonify({"success": False, "error": message}), status


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return _ok({"service": "crud-api", "supabase": bool(SUPABASE_URL)})


# ---------------------------------------------------------------------------
# Auth: register / login / logout / delete-user
# ---------------------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    business_name = (body.get("business_name") or "").strip()

    if not email or not password:
        return _err("Email and password are required", 400)
    if len(password) < 6:
        return _err("Password must be at least 6 characters", 400)

    # 1. Create the auth user via Supabase GoTrue.
    signup_res = requests.post(
        f"{AUTH_URL}/signup",
        headers=_anon_headers(),
        json={
            "email": email,
            "password": password,
            "data": {"business_name": business_name},
        },
        timeout=15,
    )
    if signup_res.status_code >= 400:
        return _err(signup_res.json().get("msg") or "Registration failed", signup_res.status_code)

    payload = signup_res.json()
    user = payload.get("user") or {}
    user_id = user.get("id")
    access_token = payload.get("access_token")

    # 2. Seed an sme_profile row so future updates can use UPDATE without a 404.
    if user_id and business_name:
        try:
            requests.post(
                f"{REST_URL}/sme_profile",
                headers=_service_headers(),
                json={
                    "user_id": user_id,
                    "business_name": business_name,
                    "business_type": body.get("business_type") or "other",
                    "location": body.get("location") or "",
                    "phone": body.get("phone") or "",
                    "email": email,
                },
                timeout=10,
            )
        except Exception as exc:  # pragma: no cover
            print(f"profile seed failed: {exc}")

    return _ok({"user": user, "access_token": access_token})


@app.route("/api/auth/login", methods=["POST"])
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    if not email or not password:
        return _err("Email and password are required", 400)

    res = requests.post(
        f"{AUTH_URL}/token?grant_type=password",
        headers=_anon_headers(),
        json={"email": email, "password": password},
        timeout=15,
    )
    if res.status_code >= 400:
        return _err(res.json().get("error_description") or "Invalid credentials", 401)
    return _ok(res.json())


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    token = (request.headers.get("Authorization") or "").replace("Bearer ", "").strip()
    if not token:
        return _ok({"logged_out": True})
    requests.post(
        f"{AUTH_URL}/logout",
        headers={**_anon_headers(), "Authorization": f"Bearer {token}"},
        timeout=10,
    )
    return _ok({"logged_out": True})


@app.route("/api/auth/user/<user_id>", methods=["DELETE"])
def delete_user(user_id: str):
    """Delete an auth user. Requires the service-role key to be set."""
    if not SUPABASE_SERVICE_KEY:
        return _err("Service role key not configured", 500)
    res = requests.delete(
        f"{AUTH_URL}/admin/users/{user_id}",
        headers=_service_headers(),
        timeout=15,
    )
    if res.status_code >= 400:
        return _err(res.text or "Could not delete user", res.status_code)
    # Cascade-clean profile row.
    requests.delete(
        f"{REST_URL}/sme_profile?user_id=eq.{user_id}",
        headers=_service_headers(),
        timeout=10,
    )
    return _ok({"deleted": user_id})


# ---------------------------------------------------------------------------
# SME profile CRUD
# ---------------------------------------------------------------------------
@app.route("/api/sme/<user_id>", methods=["GET"])
def get_sme(user_id: str):
    res = requests.get(
        f"{REST_URL}/sme_profile?user_id=eq.{user_id}&select=*",
        headers=_service_headers(),
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    rows = res.json()
    return _ok(rows[0] if rows else None)


@app.route("/api/sme", methods=["POST"])
def create_sme():
    body = request.get_json(silent=True) or {}
    if not body.get("user_id") or not body.get("business_name"):
        return _err("user_id and business_name are required", 400)
    res = requests.post(
        f"{REST_URL}/sme_profile",
        headers=_service_headers(),
        json=body,
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok(res.json())


@app.route("/api/sme/<user_id>", methods=["PUT", "PATCH"])
def update_sme(user_id: str):
    body = request.get_json(silent=True) or {}
    body.pop("user_id", None)
    res = requests.patch(
        f"{REST_URL}/sme_profile?user_id=eq.{user_id}",
        headers=_service_headers(),
        json=body,
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok(res.json())


# ---------------------------------------------------------------------------
# Events CRUD
# ---------------------------------------------------------------------------
@app.route("/api/events", methods=["GET"])
def list_events():
    res = requests.get(
        f"{REST_URL}/bazaar_events?select=*&order=event_date.asc",
        headers=_service_headers(),
        timeout=10,
    )
    return _ok(res.json() if res.status_code < 400 else [])


@app.route("/api/events/<event_id>", methods=["GET"])
def get_event(event_id: str):
    res = requests.get(
        f"{REST_URL}/bazaar_events?bazaar_id=eq.{event_id}&select=*",
        headers=_service_headers(),
        timeout=10,
    )
    rows = res.json() if res.status_code < 400 else []
    return _ok(rows[0] if rows else None)


@app.route("/api/events", methods=["POST"])
def create_event():
    body = request.get_json(silent=True) or {}
    body.setdefault("bazaar_id", str(uuid.uuid4()))
    if not body.get("event_name") or not body.get("location"):
        return _err("event_name and location are required", 400)
    res = requests.post(
        f"{REST_URL}/bazaar_events",
        headers=_service_headers(),
        json=body,
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok(res.json())


@app.route("/api/events/<event_id>", methods=["PUT", "PATCH"])
def update_event(event_id: str):
    body = request.get_json(silent=True) or {}
    res = requests.patch(
        f"{REST_URL}/bazaar_events?bazaar_id=eq.{event_id}",
        headers=_service_headers(),
        json=body,
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok(res.json())


@app.route("/api/events/<event_id>", methods=["DELETE"])
def delete_event(event_id: str):
    res = requests.delete(
        f"{REST_URL}/bazaar_events?bazaar_id=eq.{event_id}",
        headers=_service_headers(),
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok({"deleted": event_id})


# ---------------------------------------------------------------------------
# Vendor application + AI-generated proposal
# ---------------------------------------------------------------------------
@app.route("/api/applications", methods=["POST"])
def submit_application():
    body = request.get_json(silent=True) or {}
    required = ["sme_id", "event_id"]
    for key in required:
        if not body.get(key):
            return _err(f"{key} is required", 400)
    body.setdefault("application_id", str(uuid.uuid4()))
    body.setdefault("overall_status", "submitted")
    body.setdefault("submitted_at", datetime.utcnow().isoformat())
    res = requests.post(
        f"{REST_URL}/sme_event_applications",
        headers=_service_headers(),
        json=body,
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok(res.json())


@app.route("/api/applications/sme/<user_id>", methods=["GET"])
def list_applications(user_id: str):
    res = requests.get(
        f"{REST_URL}/sme_event_applications?sme_id=eq.{user_id}&select=*",
        headers=_service_headers(),
        timeout=10,
    )
    return _ok(res.json() if res.status_code < 400 else [])


@app.route("/api/applications/<app_id>", methods=["DELETE"])
def delete_application(app_id: str):
    res = requests.delete(
        f"{REST_URL}/sme_event_applications?application_id=eq.{app_id}",
        headers=_service_headers(),
        timeout=10,
    )
    if res.status_code >= 400:
        return _err(res.text, res.status_code)
    return _ok({"deleted": app_id})


@app.route("/api/proposal/generate", methods=["POST"])
def generate_proposal():
    """Generate a vendor proposal using Bedrock, grounded in profile + event."""
    body = request.get_json(silent=True) or {}
    profile = body.get("profile") or {}
    event = body.get("event") or {}
    booth = body.get("booth") or None
    sponsorship = body.get("sponsorship") or None
    app_type = (body.get("application_type") or "Vendor").strip()
    extra = (body.get("notes") or "").strip()

    if not profile.get("business_name"):
        return _err("profile.business_name is required", 400)
    if not event.get("event_name"):
        return _err("event.event_name is required", 400)

    business_name = profile.get("business_name")
    business_type = (profile.get("business_type") or "").replace("_", " ")
    business_about = profile.get("business_description") or "(not provided)"
    business_location = profile.get("location") or "(not provided)"

    event_name = event.get("event_name")
    event_type = event.get("event_type") or "bazaar"
    event_location = event.get("location") or "(location TBC)"
    event_venue = event.get("venue_name") or ""
    event_date = event.get("event_date") or "(date TBC)"
    event_audience = event.get("target_audience")
    event_desc = event.get("event_description") or "(no description provided)"

    booth_block = "(no specific booth selected)"
    if booth:
        amenities = []
        if booth.get("has_electricity"):
            amenities.append("electricity")
        if booth.get("has_water"):
            amenities.append("water")
        if booth.get("has_storage"):
            amenities.append("storage")
        if booth.get("has_parking"):
            amenities.append("parking")
        booth_block = (
            f"Booth #{booth.get('booth_number') or booth.get('booth_id', '')[:6]}"
            f" at price {booth.get('price') or 'TBC'}"
            + (f", amenities: {', '.join(amenities)}" if amenities else "")
            + (f", suitable for: {booth['suitable_for']}" if booth.get("suitable_for") else "")
        )

    sponsorship_block = "(no sponsorship tier selected)"
    if sponsorship:
        sponsorship_block = (
            f"{sponsorship.get('package_name') or sponsorship.get('tier_level', 'package')}"
            f" at price {sponsorship.get('price') or 'TBC'}"
            + (
                f". Benefits: {sponsorship['benefits']}"
                if sponsorship.get("benefits")
                else ""
            )
        )

    prompt = f"""You are a senior copywriter drafting a vendor application proposal for a small business owner. Write a polished, specific proposal that the recipient (the event organizer) will actually want to read.

OUTPUT REQUIREMENTS
- Plain prose, four paragraphs, 260-340 words total.
- No headings, no bullet lists, no emojis, no em dashes, no markdown.
- Reference the event by name in paragraph one and the business by name in paragraph two.
- Mention at least three concrete details that come from the data below (event date, location, audience size, booth amenities, sponsorship tier, business specialty, etc.).
- Do not invent facts that are not present in the data. If a fact is missing, write around it instead of guessing.
- Tone: confident, warm, specific, professional. Avoid filler ("we are excited", "synergy", "leverage").

PARAGRAPH PLAN
1) Open with one sentence stating the business is applying to the event by name, and the application type ({app_type}).
2) Describe the business: who they are, what they sell, why they fit the event audience and theme.
3) Operational fit: how the chosen booth or sponsorship plus the event's logistics line up, and any specific needs covered by the notes.
4) Close with a confident next-step request (a meeting, a confirmation, document submission).

BUSINESS PROFILE
- Name: {business_name}
- Type: {business_type or '(not provided)'}
- Location: {business_location}
- About: {business_about}

EVENT
- Name: {event_name}
- Type: {event_type}
- Date: {event_date}
- Location: {event_location}{f' ({event_venue})' if event_venue else ''}
- Target audience size: {event_audience if event_audience else '(not provided)'}
- Description: {event_desc}

APPLICATION TYPE: {app_type}
SELECTED BOOTH: {booth_block}
SELECTED SPONSORSHIP: {sponsorship_block}

VENDOR NOTES (verbatim, weave these in where they fit)
{extra or '(none)'}

Return ONLY the proposal text. No preamble, no closing remarks like "Here is the proposal:"."""

    try:
        text = llm_service._invoke_bedrock(prompt, max_tokens=1100)
        text = (text or "").strip()
        if not text:
            return _err("LLM returned an empty response", 502)
        return _ok({"proposal": text})
    except Exception as exc:
        # Surface the underlying Bedrock error so the UI can show it.
        import traceback
        traceback.print_exc()
        print(f"[proposal] LLM error: {exc}")
        return _err(f"LLM error: {exc}", 500)


# ---------------------------------------------------------------------------
# Booths + sponsorships (read-only helpers for the apply page)
# ---------------------------------------------------------------------------
@app.route("/api/events/<event_id>/booths", methods=["GET"])
def list_booths(event_id: str):
    res = requests.get(
        f"{REST_URL}/bazaar_booths?event_id=eq.{event_id}&select=*",
        headers=_service_headers(),
        timeout=10,
    )
    return _ok(res.json() if res.status_code < 400 else [])


@app.route("/api/events/<event_id>/sponsorships", methods=["GET"])
def list_sponsorships(event_id: str):
    res = requests.get(
        f"{REST_URL}/sponsorship_package?event_id=eq.{event_id}&select=*",
        headers=_service_headers(),
        timeout=10,
    )
    return _ok(res.json() if res.status_code < 400 else [])


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
