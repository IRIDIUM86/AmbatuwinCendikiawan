"""Vercel serverless entry for the CRUD + auth + proposal backend."""
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from crud_api import app as flask_app


def app(environ, start_response):
    """Strip the /api/v2 prefix before Flask sees it."""
    path = environ.get("PATH_INFO", "")
    if path.startswith("/api/v2"):
        environ["PATH_INFO"] = path[len("/api/v2"):] or "/"
        environ["SCRIPT_NAME"] = environ.get("SCRIPT_NAME", "") + "/api/v2"
    return flask_app(environ, start_response)
