"""
Gemini AI service.

Encapsulates all communication with the Google Gemini API.
This module knows nothing about failover — it makes a single request
and either returns the generated text or raises a typed exception.
"""

from __future__ import annotations

import time
from typing import Optional

import httpx

from app.utils.exceptions import (
    ProviderAuthenticationError,
    ProviderError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"
REQUEST_TIMEOUT = 60.0  # seconds


async def generate(
    prompt: str,
    api_key: str,
    model: str = "gemini-3.6-flash",
    *,
    key_index: Optional[int] = None,
) -> str:
    """
    Send a prompt to Google Gemini and return the generated text.

    Parameters
    ----------
    prompt : str
        The user's task prompt.
    api_key : str
        A valid Gemini API key.
    model : str
        The Gemini model identifier.
    key_index : int | None
        Numeric index of the key (for logging only — the value is never logged).

    Returns
    -------
    str
        The generated text content.

    Raises
    ------
    ProviderAuthenticationError
        When the key is invalid or revoked.
    ProviderRateLimitError
        When quota or rate limits are hit.
    ProviderUnavailableError
        When the service returns 503 or is unreachable.
    ProviderError
        For any other non-retryable Gemini error.
    """
    url = f"{GEMINI_API_BASE}/{model}:generateContent"
    key_label = f"key-{key_index}" if key_index is not None else "key"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
        },
    }

    logger.info("Gemini request started — model=%s, %s", model, key_label)
    start = time.monotonic()

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.post(
                url,
                json=payload,
                params={"key": api_key},
            )
    except httpx.TimeoutException:
        elapsed = round((time.monotonic() - start) * 1000)
        logger.warning("Gemini timeout after %dms — %s", elapsed, key_label)
        raise ProviderUnavailableError(
            provider="gemini",
            detail=f"Request timed out after {elapsed}ms",
        )
    except httpx.RequestError as exc:
        logger.warning("Gemini connection error — %s: %s", key_label, type(exc).__name__)
        raise ProviderUnavailableError(
            provider="gemini",
            detail=f"Connection error: {type(exc).__name__}",
        )

    elapsed = round((time.monotonic() - start) * 1000)
    status = response.status_code

    # -- Error classification -------------------------------------------------
    if status in (401, 403):
        logger.warning("Gemini auth failure (%d) — %s", status, key_label)
        raise ProviderAuthenticationError(
            provider="gemini",
            detail=f"HTTP {status} — invalid or revoked API key",
        )

    if status == 429:
        logger.warning("Gemini rate-limited (429) — %s", key_label)
        raise ProviderRateLimitError(
            provider="gemini",
            detail="Rate limit or quota exceeded",
        )

    if status == 503 or status == 502:
        logger.warning("Gemini unavailable (%d) — %s", status, key_label)
        raise ProviderUnavailableError(
            provider="gemini",
            detail=f"HTTP {status} — service unavailable",
        )

    if status >= 500:
        logger.warning("Gemini server error (%d) — %s", status, key_label)
        raise ProviderUnavailableError(
            provider="gemini",
            detail=f"HTTP {status} — server error",
        )

    if status >= 400:
        # Client errors (400, 404, etc.) are non-retryable
        body = response.text[:300]
        logger.error("Gemini client error (%d) — %s: %s", status, key_label, body)
        raise ProviderError(
            message=f"Gemini returned HTTP {status}.",
            status_code=status,
            provider="gemini",
            detail=body,
        )

    # -- Parse successful response --------------------------------------------
    try:
        data = response.json()
        text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )
        if not text:
            raise ValueError("Empty text in Gemini response")
    except (ValueError, KeyError, IndexError) as exc:
        logger.error("Gemini response parse error — %s: %s", key_label, exc)
        raise ProviderError(
            message="Failed to parse Gemini response.",
            status_code=502,
            provider="gemini",
            detail=str(exc),
        )

    logger.info(
        "Gemini response received — %dms, %d chars, %s",
        elapsed,
        len(text),
        key_label,
    )
    return text
