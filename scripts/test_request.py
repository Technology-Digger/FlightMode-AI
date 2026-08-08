"""
Manual API Test Tool.

Sends a real POST /api/automation request to the running backend
and prints the result summary.

Usage:
    python scripts/test_request.py

Requires the backend to be running on http://127.0.0.1:8000.
"""

import json
import time
import urllib.request

url = "http://127.0.0.1:8000/api/automation"
data = json.dumps({
    "prompt": "Can you summarize the plot of The Matrix in one sentence?",
    "enableFallback": True,
}).encode("utf-8")

headers = {"Content-Type": "application/json"}
req = urllib.request.Request(url, data=data, headers=headers)

start_time = time.time()
try:
    with urllib.request.urlopen(req) as response:
        latency = int((time.time() - start_time) * 1000)
        status = response.getcode()
        resp_data = json.loads(response.read().decode())

        print(f"STATUS:   {status}")
        print(f"MODEL:    {resp_data.get('model', 'unknown')}")
        print(f"PROVIDER: {resp_data.get('provider', 'unknown')}")
        print(f"FALLBACK: {resp_data.get('fallback_used', False)}")
        print(f"LATENCY:  {latency} ms")
except urllib.error.HTTPError as e:
    print(f"STATUS: {e.code}")
    print(f"ERROR:  {e.read().decode()}")
except Exception as e:
    print(f"ERROR: {e}")
