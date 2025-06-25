"""
GlucoVision Core Package
========================

Core functionality for the GlucoVision application.
Contains configuration, database, and security modules.

Modules:
- config: Application configuration and settings
- database: Database connection and session management
- security: Authentication and security utilities
"""

# Only import settings to avoid circular imports
from app.core.config import settings

__all__ = [
    "settings",
]
