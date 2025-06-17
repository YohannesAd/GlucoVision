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

from app.core.config import settings
from app.core.database import get_async_session, create_tables
from app.core.security import get_current_user, security_manager

__all__ = [
    "settings",
    "get_async_session",
    "create_tables", 
    "get_current_user",
    "security_manager",
]
