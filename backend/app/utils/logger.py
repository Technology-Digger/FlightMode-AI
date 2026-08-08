"""
Centralized logging configuration.

Provides a single ``get_logger`` factory that returns a named logger with
structured formatting. Every module should use::

    from app.utils.logger import get_logger
    logger = get_logger(__name__)

Security: log messages are filtered to prevent accidental secret leakage.
"""

from __future__ import annotations

import logging
import re
import sys
from typing import Final

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
LOG_FORMAT: Final[str] = (
    "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
)
DATE_FORMAT: Final[str] = "%Y-%m-%d %H:%M:%S"

# Pattern matching common API-key shapes (32+ hex/alphanum characters)
_SECRET_PATTERN: Final[re.Pattern[str]] = re.compile(
    r"(?i)(api[_-]?key|token|secret|password|authorization)[=:\s]+\S+",
)


class _SecretFilter(logging.Filter):
    """Redact anything that looks like a secret from log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            record.msg = _SECRET_PATTERN.sub(r"\1=***REDACTED***", record.msg)
        return True


def _configure_root_logger() -> None:
    """One-time setup for the root logger — called on first import."""
    root = logging.getLogger()
    if root.handlers:
        return  # Already configured

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    handler.addFilter(_SecretFilter())

    root.addHandler(handler)
    root.setLevel(logging.INFO)


# Run once on module load
_configure_root_logger()


def get_logger(name: str) -> logging.Logger:
    """Return a logger bound to *name* with the shared formatter and filter."""
    logger = logging.getLogger(name)
    return logger
