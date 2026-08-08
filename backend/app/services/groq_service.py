"""
Groq AI service.

Encapsulates all communication with the Groq API (OpenAI-compatible).
Acts as the last-resort backup provider after all Gemini keys are exhausted.
"""

from __future__ import annotations

import time

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
GROQ_API_BASE = "https://api.groq.com/openai/v1/chat/completions"
REQUEST_TIMEOUT = 60.0  # seconds


async def generate(
    prompt: str,
    api_key: str,
    model: str = "llama-3.3-70b-versatile",
) -> str:
    """
    Send a prompt to Groq and return the generated text.

    Parameters
    ----------
    prompt : str
        The user's task prompt.
    api_key : str
        A valid Groq API key.
    model : str
        The Groq model identifier.

    Returns
    -------
    str
        The generated text content.

    Raises
    ------
    ProviderAuthenticationError
        When the key is invalid.
    ProviderRateLimitError
        When rate limits are hit.
    ProviderUnavailableError
        When the service is unreachable.
    ProviderError
        For any other Groq error.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are Flight Mode AI, a professional assistant that completes "
                    "complex workflows. Respond in well-structured Markdown with clear "
                    "headings, bullet points, and code blocks where appropriate."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 0.7,
        "max_tokens": 8192,
    }

    logger.info("Groq request started — model=%s", model)
    start = time.monotonic()

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            response = await client.post(
                GROQ_API_BASE,
                json=payload,
                headers=headers,
            )
    except httpx.TimeoutException:
        elapsed = round((time.monotonic() - start) * 1000)
        logger.warning("Groq timeout after %dms", elapsed)
        raise ProviderUnavailableError(
            provider="groq",
            detail=f"Request timed out after {elapsed}ms",
        )
    except httpx.RequestError as exc:
        logger.warning("Groq connection error — %s", type(exc).__name__)
        raise ProviderUnavailableError(
            provider="groq",
            detail=f"Connection error: {type(exc).__name__}",
        )

    elapsed = round((time.monotonic() - start) * 1000)
    status = response.status_code

    # -- Error classification -------------------------------------------------
    if status in (401, 403):
        logger.warning("Groq auth failure (%d)", status)
        raise ProviderAuthenticationError(
            provider="groq",
            detail=f"HTTP {status} — invalid or revoked API key",
        )

    if status == 429:
        logger.warning("Groq rate-limited (429)")
        raise ProviderRateLimitError(
            provider="groq",
            detail="Rate limit or quota exceeded",
        )

    if status == 503 or status == 502:
        logger.warning("Groq unavailable (%d)", status)
        raise ProviderUnavailableError(
            provider="groq",
            detail=f"HTTP {status} — service unavailable",
        )

    if status >= 500:
        logger.warning("Groq server error (%d)", status)
        raise ProviderUnavailableError(
            provider="groq",
            detail=f"HTTP {status} — server error",
        )

    if status >= 400:
        body = response.text[:300]
        logger.error("Groq client error (%d): %s", status, body)
        raise ProviderError(
            message=f"Groq returned HTTP {status}.",
            status_code=status,
            provider="groq",
            detail=body,
        )

    # -- Parse successful response --------------------------------------------
    try:
        data = response.json()
        text = data["choices"][0]["message"]["content"]
        if not text:
            raise ValueError("Empty content in Groq response")
    except (ValueError, KeyError, IndexError) as exc:
        logger.error("Groq response parse error: %s", exc)
        raise ProviderError(
            message="Failed to parse Groq response.",
            status_code=502,
            provider="groq",
            detail=str(exc),
        )

    logger.info("Groq response received — %dms, %d chars", elapsed, len(text))
    return text
