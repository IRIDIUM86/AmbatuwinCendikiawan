"""Vercel serverless entry for the original matching backend."""
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from api_server import app as flask_app


def app(environ, start_response):
    """Strip the /api/v1 prefix before Flask sees it."""
    path = environ.get("PATH_INFO", "")
    if path.startswith("/api/v1"):
        environ["PATH_INFO"] = path[len("/api/v1"):] or "/"
        environ["SCRIPT_NAME"] = environ.get("SCRIPT_NAME", "") + "/api/v1"
    return flask_app(environ, start_response)
