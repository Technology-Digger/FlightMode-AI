"""
API tests for the FlightMode AI Gateway.

Uses FastAPI's TestClient (synchronous wrapper around httpx) to exercise
the health and automation endpoints without hitting real AI providers.
"""

from __future__ import annotations

import os
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

# ---------------------------------------------------------------------------
# Ensure test environment variables are set BEFORE importing the app
# ---------------------------------------------------------------------------
os.environ.setdefault("GEMINI_API_KEY_1", "test-gemini-key-1")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key")
os.environ.setdefault("DEBUG", "True")

from app.main import app  # noqa: E402
from app.services.failover_manager import FailoverResult  # noqa: E402

client = TestClient(app)


# ═══════════════════════════════════════════════════════════════════════════
# Health endpoint
# ═══════════════════════════════════════════════════════════════════════════


class TestHealthEndpoint:
    """Tests for GET /health."""

    def test_health_returns_200(self) -> None:
        """Health endpoint returns 200 with expected shape."""
        response = client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert "status" in data
        assert "version" in data
        assert "providers" in data
        assert data["status"] in ("online", "degraded", "offline")

    def test_health_contains_providers(self) -> None:
        """Health response lists both configured providers."""
        response = client.get("/health")
        data = response.json()

        provider_names = [p["providerId"] for p in data["providers"]]
        assert "gemini" in provider_names
        assert "groq" in provider_names

    def test_health_version_string(self) -> None:
        """Health response contains a valid version string."""
        response = client.get("/health")
        data = response.json()
        assert data["version"] == "1.0.0"


# ═══════════════════════════════════════════════════════════════════════════
# Automation endpoint — successful cases
# ═══════════════════════════════════════════════════════════════════════════


class TestAutomationSuccess:
    """Tests for POST /api/automation — happy path."""

    @patch("app.services.provider.execute", new_callable=AsyncMock)
    def test_automation_returns_content(self, mock_execute: AsyncMock) -> None:
        """Valid request returns AI-generated content."""
        mock_execute.return_value = FailoverResult(
            content="# Test Report\n\nThis is generated content.",
            provider="gemini",
            model="gemini-2.0-flash",
            fallback_used=False,
            processing_time_ms=1234,
            attempts=1,
            key_index=1,
        )

        response = client.post(
            "/api/automation",
            json={"prompt": "Write a test report about software testing best practices."},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "# Test Report\n\nThis is generated content."
        assert data["provider"] == "gemini"
        assert data["model"] == "gemini-2.0-flash"
        assert data["fallback_used"] is False
        assert data["processing_time_ms"] == 1234

    @patch("app.services.provider.execute", new_callable=AsyncMock)
    def test_automation_with_fallback(self, mock_execute: AsyncMock) -> None:
        """Response indicates when fallback was used."""
        mock_execute.return_value = FailoverResult(
            content="Groq-generated content.",
            provider="groq",
            model="llama-3.3-70b-versatile",
            fallback_used=True,
            processing_time_ms=2500,
            attempts=3,
        )

        response = client.post(
            "/api/automation",
            json={"prompt": "Analyze market trends for the AI industry in 2026."},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["provider"] == "groq"
        assert data["fallback_used"] is True

    @patch("app.services.provider.execute", new_callable=AsyncMock)
    def test_automation_with_optional_fields(self, mock_execute: AsyncMock) -> None:
        """Request with all optional fields is accepted."""
        mock_execute.return_value = FailoverResult(
            content="Content with options.",
            provider="gemini",
            model="gemini-2.0-flash",
            fallback_used=False,
            processing_time_ms=800,
            attempts=1,
            key_index=1,
        )

        response = client.post(
            "/api/automation",
            json={
                "prompt": "Create a detailed competitive analysis for project management tools.",
                "templateId": "competitor-analysis",
                "providerId": "openai",
                "enableFallback": True,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "Content with options."


# ═══════════════════════════════════════════════════════════════════════════
# Automation endpoint — validation errors
# ═══════════════════════════════════════════════════════════════════════════


class TestAutomationValidation:
    """Tests for POST /api/automation — input validation."""

    def test_missing_prompt_returns_422(self) -> None:
        """Request without a prompt is rejected."""
        response = client.post("/api/automation", json={})
        assert response.status_code == 422

    def test_empty_prompt_returns_422(self) -> None:
        """Empty prompt string is rejected."""
        response = client.post("/api/automation", json={"prompt": ""})
        assert response.status_code == 422

    def test_short_prompt_returns_422(self) -> None:
        """Prompt below the 10-character minimum is rejected."""
        response = client.post("/api/automation", json={"prompt": "Hi"})
        assert response.status_code == 422

    def test_long_prompt_returns_422(self) -> None:
        """Prompt exceeding 4000 characters is rejected."""
        response = client.post(
            "/api/automation",
            json={"prompt": "x" * 4001},
        )
        assert response.status_code == 422

    def test_invalid_json_returns_422(self) -> None:
        """Malformed JSON body is rejected."""
        response = client.post(
            "/api/automation",
            content="not json",
            headers={"Content-Type": "application/json"},
        )
        assert response.status_code == 422


# ═══════════════════════════════════════════════════════════════════════════
# Automation endpoint — provider errors
# ═══════════════════════════════════════════════════════════════════════════


class TestAutomationProviderErrors:
    """Tests for POST /api/automation — provider failure handling."""

    @patch("app.services.provider.execute", new_callable=AsyncMock)
    def test_all_providers_exhausted_returns_503(self, mock_execute: AsyncMock) -> None:
        """AllProvidersExhaustedError surfaces as 503."""
        from app.utils.exceptions import AllProvidersExhaustedError

        mock_execute.side_effect = AllProvidersExhaustedError(
            detail="Tried 3 providers."
        )

        response = client.post(
            "/api/automation",
            json={"prompt": "Generate a report that will trigger provider failures."},
        )

        assert response.status_code == 503
        data = response.json()
        assert "error" in data
        assert data["status_code"] == 503

    @patch("app.services.provider.execute", new_callable=AsyncMock)
    def test_provider_error_returns_502(self, mock_execute: AsyncMock) -> None:
        """ProviderError surfaces as 502."""
        from app.utils.exceptions import ProviderError

        mock_execute.side_effect = ProviderError(
            message="Gemini returned HTTP 500.",
            status_code=502,
            provider="gemini",
        )

        response = client.post(
            "/api/automation",
            json={"prompt": "Generate content that triggers a provider error response."},
        )

        assert response.status_code == 502
        data = response.json()
        assert "error" in data


# ═══════════════════════════════════════════════════════════════════════════
# CORS
# ═══════════════════════════════════════════════════════════════════════════


class TestCORS:
    """Verify CORS headers are present."""

    def test_cors_allows_origin(self) -> None:
        """OPTIONS preflight returns correct CORS headers."""
        response = client.options(
            "/api/automation",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers


# ═══════════════════════════════════════════════════════════════════════════
# 404
# ═══════════════════════════════════════════════════════════════════════════


class TestNotFound:
    """Unknown routes return 404."""

    def test_unknown_route_returns_404(self) -> None:
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
