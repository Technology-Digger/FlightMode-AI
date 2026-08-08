"""
Intelligent failover manager.

Owns the retry/rotation logic across all configured providers:

    Gemini Key 1 → Key 2 → … → Key N → Groq

Rotates ONLY on retryable errors (429, 503, quota, rate-limit, auth failure,
timeout). Never rotates on 400-level validation / bad-request errors — those
are surfaced immediately.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import List, Optional

from app.config import Settings, get_settings
from app.services import gemini_service, groq_service
from app.utils.exceptions import (
    AllProvidersExhaustedError,
    ProviderAuthenticationError,
    ProviderError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Retryable exception types — failover rotates on these
# ---------------------------------------------------------------------------
_RETRYABLE_EXCEPTIONS = (
    ProviderAuthenticationError,
    ProviderRateLimitError,
    ProviderUnavailableError,
)


@dataclass
class FailoverResult:
    """Outcome of a failover-managed request."""

    content: str
    provider: str
    model: str
    fallback_used: bool
    processing_time_ms: int
    attempts: int
    key_index: Optional[int] = None


@dataclass
class _Attempt:
    """Internal record of one provider attempt."""

    provider: str
    key_index: Optional[int]
    error: str


async def execute(prompt: str) -> FailoverResult:
    """
    Execute a prompt with automatic failover across all providers.

    The priority chain is:
        1. Gemini keys in order (GEMINI_API_KEY_1, _2, …)
        2. Groq as the final backup

    Parameters
    ----------
    prompt : str
        The validated user prompt.

    Returns
    -------
    FailoverResult
        The generated content and metadata.

    Raises
    ------
    AllProvidersExhaustedError
        When every provider has been tried and failed.
    ProviderError
        When a non-retryable error occurs (400-level client errors).
    """
    settings: Settings = get_settings()
    attempts: List[_Attempt] = []
    start = time.monotonic()

    # ------------------------------------------------------------------
    # Phase 1 — Try every Gemini key in order
    # ------------------------------------------------------------------
    for index, api_key in enumerate(settings.gemini_api_keys):
        try:
            content = await gemini_service.generate(
                prompt=prompt,
                api_key=api_key,
                model=settings.gemini_model,
                key_index=index + 1,
            )
            elapsed = round((time.monotonic() - start) * 1000)
            return FailoverResult(
                content=content,
                provider="gemini",
                model=settings.gemini_model,
                fallback_used=len(attempts) > 0,
                processing_time_ms=elapsed,
                attempts=len(attempts) + 1,
                key_index=index + 1,
            )
        except _RETRYABLE_EXCEPTIONS as exc:
            attempts.append(
                _Attempt(
                    provider="gemini",
                    key_index=index + 1,
                    error=str(exc),
                )
            )
            logger.warning(
                "Gemini key-%d failed (retryable) — rotating: %s",
                index + 1,
                exc.message,
            )
            continue
        except ProviderError:
            # Non-retryable (400, validation) — propagate immediately
            raise

    # ------------------------------------------------------------------
    # Phase 2 — Fall back to Groq
    # ------------------------------------------------------------------
    if settings.has_groq:
        try:
            content = await groq_service.generate(
                prompt=prompt,
                api_key=settings.groq_api_key,
                model=settings.groq_model,
            )
            elapsed = round((time.monotonic() - start) * 1000)
            logger.info(
                "Groq backup succeeded after %d Gemini attempt(s)",
                len(attempts),
            )
            return FailoverResult(
                content=content,
                provider="groq",
                model=settings.groq_model,
                fallback_used=True,
                processing_time_ms=elapsed,
                attempts=len(attempts) + 1,
            )
        except _RETRYABLE_EXCEPTIONS as exc:
            attempts.append(
                _Attempt(provider="groq", key_index=None, error=str(exc))
            )
            logger.warning("Groq backup failed — %s", exc.message)
        except ProviderError:
            raise

    # ------------------------------------------------------------------
    # All providers exhausted
    # ------------------------------------------------------------------
    total_attempts = len(attempts)
    logger.error(
        "All providers exhausted after %d attempt(s): %s",
        total_attempts,
        "; ".join(f"{a.provider}(key={a.key_index}): {a.error}" for a in attempts),
    )
    raise AllProvidersExhaustedError(
        detail=f"Tried {total_attempts} provider(s) — all returned retryable errors.",
    )
