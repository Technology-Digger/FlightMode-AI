"""
Pydantic request and response models.

Shapes match the frontend's ``TaskRequest`` type and the expected
JSON response format inferred from the frontend services.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request
# ---------------------------------------------------------------------------


class AutomationRequest(BaseModel):
    """
    Inbound payload for ``POST /api/automation``.

    Mirrors the frontend ``TaskRequest`` interface::

        { prompt: string; templateId?: string; providerId?: string; enableFallback?: boolean }
    """

    prompt: str = Field(
        ...,
        min_length=10,
        max_length=4000,
        description="The task prompt to send to the AI provider.",
    )
    templateId: Optional[str] = Field(
        default=None,
        description="Optional template identifier used to launch the task.",
    )
    providerId: Optional[str] = Field(
        default=None,
        description="Preferred provider ID (informational — the backend chooses the actual provider).",
    )
    enableFallback: Optional[bool] = Field(
        default=True,
        description="Whether the backend should fall back to alternate providers on failure.",
    )


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------


class AutomationResponse(BaseModel):
    """
    Outbound payload for ``POST /api/automation``.

    The frontend consumes ``content`` (markdown) and the metadata fields
    to populate the result card and execution summary.
    """

    content: str = Field(
        ...,
        description="AI-generated content in Markdown format.",
    )
    provider: str = Field(
        ...,
        description="Provider that produced the response (e.g. 'gemini', 'groq').",
    )
    model: str = Field(
        ...,
        description="Model identifier used for generation.",
    )
    fallback_used: bool = Field(
        default=False,
        description="Whether a fallback provider was used.",
    )
    processing_time_ms: int = Field(
        ...,
        description="Total wall-clock time in milliseconds.",
    )


# ---------------------------------------------------------------------------
# Error
# ---------------------------------------------------------------------------


class ErrorResponse(BaseModel):
    """Standardized error envelope returned by every error handler."""

    error: str = Field(..., description="Human-readable error message.")
    detail: Optional[str] = Field(
        default=None,
        description="Optional technical detail (omitted in production).",
    )
    status_code: int = Field(..., description="HTTP status code.")


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


class ProviderHealthItem(BaseModel):
    """Health status of a single provider."""

    providerId: str = Field(..., description="Provider identifier.")
    status: str = Field(..., description="Status: 'operational', 'degraded', or 'outage'.")
    latencyMs: int = Field(..., description="Response time in ms.")
    lastChecked: int = Field(..., description="Timestamp of last check.")


class HealthResponse(BaseModel):
    """
    Outbound payload for ``GET /health``.

    The frontend ``getGatewayHealth()`` service consumes this to populate
    the AI Gateway status card.
    """

    status: str = Field(..., description="Gateway status: 'online', 'degraded', or 'offline'.")
    version: str = Field(..., description="Application version string.")
    latencyMs: int = Field(..., description="Gateway response time in ms.")
    uptimePct: float = Field(..., description="Gateway uptime percentage.")
    providers: list[ProviderHealthItem] = Field(
        default_factory=list,
        description="Per-provider availability.",
    )
    lastChecked: int = Field(..., description="Timestamp of last check.")
