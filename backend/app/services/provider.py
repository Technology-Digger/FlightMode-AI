"""
Provider service — single public interface.

Routes only call this module. This module only calls failover_manager.
The rest of the system (Gemini/Groq services, key rotation) is hidden
behind this boundary.
"""

from __future__ import annotations

from app.services.failover_manager import FailoverResult, execute
from app.utils.logger import get_logger

logger = get_logger(__name__)


async def process_prompt(prompt: str) -> FailoverResult:
    """
    Process a user prompt through the AI provider chain.

    This is the only entry point that API routes should call.
    Internally it delegates to the failover manager, which handles
    key rotation, retries, and provider fallback.

    Parameters
    ----------
    prompt : str
        The validated user prompt.

    Returns
    -------
    FailoverResult
        AI-generated content with provider metadata.

    Raises
    ------
    AllProvidersExhaustedError
        If every provider fails.
    ProviderError
        If a non-retryable provider error occurs.
    FlightModeError
        For any other classified error.
    """
    logger.info("Processing prompt — %d chars", len(prompt))
    result = await execute(prompt)
    logger.info(
        "Prompt processed — provider=%s, model=%s, fallback=%s, %dms, %d attempt(s)",
        result.provider,
        result.model,
        result.fallback_used,
        result.processing_time_ms,
        result.attempts,
    )
    return result
