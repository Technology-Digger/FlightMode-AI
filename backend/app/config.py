"""
Application configuration.

Loads environment variables from .env, validates required values, and
dynamically collects every GEMINI_API_KEY_* key so new keys can be
added without touching code.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Load .env file (no-op in production where env vars are set by the host)
# ---------------------------------------------------------------------------
load_dotenv()


class Settings:
    """Immutable application settings derived from the environment."""

    # -- Server ---------------------------------------------------------------
    host: str
    port: int
    debug: bool

    # -- AI providers ---------------------------------------------------------
    gemini_api_keys: List[str]
    groq_api_key: str

    # -- Gemini model ---------------------------------------------------------
    gemini_model: str

    # -- Groq model -----------------------------------------------------------
    groq_model: str

    def __init__(self) -> None:
        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8000"))
        self.debug = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

        # Dynamically collect every GEMINI_API_KEY_* variable
        self.gemini_api_keys = self._collect_gemini_keys()
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")

        # Model identifiers — overridable via env for future upgrades
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self.groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # -- Helpers --------------------------------------------------------------

    @staticmethod
    def _collect_gemini_keys() -> List[str]:
        """Return a sorted list of non-empty GEMINI_API_KEY_* values."""
        keys: List[str] = []
        for name, value in sorted(os.environ.items()):
            if name.startswith("GEMINI_API_KEY_") and value:
                keys.append(value)
        return keys

    @property
    def has_gemini(self) -> bool:
        """True when at least one Gemini key is configured."""
        return len(self.gemini_api_keys) > 0

    @property
    def has_groq(self) -> bool:
        """True when the Groq backup key is configured."""
        return bool(self.groq_api_key)

    def validate(self) -> None:
        """Raise if no AI provider is usable."""
        if not self.has_gemini and not self.has_groq:
            raise RuntimeError(
                "No AI provider keys configured. "
                "Set at least one GEMINI_API_KEY_* or GROQ_API_KEY in the environment."
            )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Singleton accessor — settings are loaded once and cached."""
    settings = Settings()
    settings.validate()
    return settings
