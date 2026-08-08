"""
Gemini Model Discovery Tool.

Queries the Google Generative AI Models API to find all models
supporting generateContent, then selects the best low-cost
production model from a priority list.

Usage:
    python scripts/find_model.py

Requires GEMINI_API_KEY_1 in the environment (or .env).
"""

import json
import os
import urllib.request

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY_1", "")
if not API_KEY:
    print("ERROR: Set GEMINI_API_KEY_1 in .env or environment.")
    raise SystemExit(1)

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())

    models = data.get("models", [])
    valid_models = []

    for m in models:
        methods = m.get("supportedGenerationMethods", [])
        if "generateContent" in methods:
            name = m.get("name", "").replace("models/", "")
            valid_models.append(name)

    priority = [
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
    ]

    selected_model = None
    for p in priority:
        if p in valid_models:
            selected_model = p
            break

    if not selected_model and valid_models:
        selected_model = valid_models[0]

    print(f"Available models ({len(valid_models)}):")
    for m in valid_models:
        marker = " <-- SELECTED" if m == selected_model else ""
        print(f"  - {m}{marker}")
    print(f"\nSELECTED_MODEL={selected_model}")

except Exception as e:
    print(f"ERROR: {e}")
