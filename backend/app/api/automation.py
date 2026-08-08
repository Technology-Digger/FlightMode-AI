"""
Automation API route.

Defines ``POST /api/automation`` — the single endpoint the frontend calls
to execute an AI-powered task. Validates the request, delegates to the
provider service, and returns a clean JSON response.
"""

from __future__ import annotations

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.models.schemas import AutomationRequest, AutomationResponse, ErrorResponse
from app.services.provider import process_prompt
from app.utils.exceptions import FlightModeError
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api", tags=["automation"])


@router.post(
    "/automation",
    response_model=AutomationResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Validation error"},
        502: {"model": ErrorResponse, "description": "Provider error"},
        503: {"model": ErrorResponse, "description": "All providers exhausted"},
    },
    summary="Execute an AI automation task",
    description=(
        "Accepts a task prompt, routes it through the provider chain "
        "(Gemini → Groq backup), and returns the AI-generated content."
    ),
)
async def run_automation(request: AutomationRequest) -> AutomationResponse:
    """
    Process an automation request.

    The request body matches the frontend's ``TaskRequest`` interface.
    The response provides the generated markdown content plus provider
    metadata so the frontend can populate the result card.
    """
    logger.info(
        "Automation request — prompt_len=%d, templateId=%s, providerId=%s, fallback=%s",
        len(request.prompt),
        request.templateId,
        request.providerId,
        request.enableFallback,
    )

    try:
        result = await process_prompt(request.prompt)
    except FlightModeError as exc:
        logger.warning(
            "Automation failed — %s (status=%d)",
            exc.message,
            exc.status_code,
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                error=exc.message,
                detail=exc.detail,
                status_code=exc.status_code,
            ).model_dump(),
        )

    response = AutomationResponse(
        content=result.content,
        provider=result.provider,
        model=result.model,
        fallback_used=result.fallback_used,
        processing_time_ms=result.processing_time_ms,
    )

    logger.info(
        "Automation complete — provider=%s, fallback=%s, %dms",
        result.provider,
        result.fallback_used,
        result.processing_time_ms,
    )

    return response
