"""
Custom exception hierarchy.

All exceptions subclass ``FlightModeError`` so that a single handler in
``main.py`` can catch them and return a clean JSON response to the frontend.
"""

from __future__ import annotations

from typing import Optional


class FlightModeError(Exception):
    """Base exception for FlightMode AI backend."""

    def __init__(
        self,
        message: str = "An internal error occurred.",
        status_code: int = 500,
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail


class ProviderError(FlightModeError):
    """Raised when a single AI provider request fails."""

    def __init__(
        self,
        message: str = "AI provider request failed.",
        status_code: int = 502,
        *,
        provider: Optional[str] = None,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(message, status_code, detail=detail)
        self.provider = provider


class AllProvidersExhaustedError(FlightModeError):
    """Raised when every provider (Gemini keys + Groq) has failed."""

    def __init__(
        self,
        message: str = "All AI providers are currently unavailable. Please try again later.",
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(message, status_code=503, detail=detail)


class ValidationError(FlightModeError):
    """Raised for request validation failures that bypass Pydantic."""

    def __init__(
        self,
        message: str = "Invalid request.",
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(message, status_code=400, detail=detail)


class ProviderAuthenticationError(ProviderError):
    """Raised when a provider rejects the API key (401 / 403)."""

    def __init__(
        self,
        provider: Optional[str] = None,
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(
            message="Provider authentication failed.",
            status_code=502,
            provider=provider,
            detail=detail,
        )


class ProviderRateLimitError(ProviderError):
    """Raised when a provider returns 429 / quota-exceeded."""

    def __init__(
        self,
        provider: Optional[str] = None,
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(
            message="Provider rate limit exceeded.",
            status_code=502,
            provider=provider,
            detail=detail,
        )


class ProviderUnavailableError(ProviderError):
    """Raised when a provider returns 503 or is unreachable."""

    def __init__(
        self,
        provider: Optional[str] = None,
        *,
        detail: Optional[str] = None,
    ) -> None:
        super().__init__(
            message="Provider temporarily unavailable.",
            status_code=502,
            provider=provider,
            detail=detail,
        )
