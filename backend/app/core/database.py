"""
GlucoVision Database Configuration
=================================

Professional database setup using SQLAlchemy 2.0 with async support.
Handles PostgreSQL connections, session management, and table creation.

Features:
- Async SQLAlchemy 2.0 support
- PostgreSQL with SQLite fallback
- Professional session management
- Medical-grade data integrity
- Connection pooling and optimization
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import create_engine, MetaData
from typing import AsyncGenerator
import logging

from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)


# Database Metadata with naming convention for constraints
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s"
    }
)


class Base(DeclarativeBase):
    """
    Base class for all database models
    
    Provides common functionality and metadata configuration
    for all SQLAlchemy models in the application.
    """
    metadata = metadata


# Async Database Engine
if settings.USE_SQLITE:
    # SQLite configuration (no pooling parameters)
    async_engine = create_async_engine(
        settings.database_url_async,
        echo=settings.DEBUG,  # Log SQL queries in debug mode
    )
else:
    # PostgreSQL configuration (with pooling)
    async_engine = create_async_engine(
        settings.database_url_async,
        echo=settings.DEBUG,  # Log SQL queries in debug mode
        pool_pre_ping=True,   # Verify connections before use
        pool_recycle=3600,    # Recycle connections every hour
        pool_size=10,         # Connection pool size
        max_overflow=20,      # Maximum overflow connections
    )

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=True,
    autocommit=False,
)

# Sync Engine (for migrations and admin tasks)
if settings.USE_SQLITE:
    # SQLite configuration (no pooling parameters)
    sync_engine = create_engine(
        settings.database_url_sync,
        echo=settings.DEBUG,
    )
else:
    # PostgreSQL configuration (with pooling)
    sync_engine = create_engine(
        settings.database_url_sync,
        echo=settings.DEBUG,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

# Sync Session Factory
SessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False,
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async Database Session Dependency

    Provides async database sessions for FastAPI endpoints.
    Handles session lifecycle and automatic cleanup.

    Yields:
        AsyncSession: Database session for async operations
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()

            # Only log database-related errors, not HTTP exceptions
            from fastapi import HTTPException
            if not isinstance(e, HTTPException):
                logger.error(f"Database session error: {e}")

            raise
        finally:
            await session.close()


def get_sync_session():
    """
    Sync Database Session Dependency
    
    Provides synchronous database sessions for migrations
    and administrative tasks.
    
    Yields:
        Session: Database session for sync operations
    """
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Sync database session error: {e}")
        raise
    finally:
        session.close()


async def create_tables():
    """
    Create Database Tables
    
    Creates all database tables defined in models.
    Used during application startup and testing.
    """
    try:
        async with async_engine.begin() as conn:
            # Import all database models to ensure they're registered
            from app.DatabaseModels import user, glucose_log, password_reset

            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            logger.info("✅ Database tables created successfully")
            
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise


async def drop_tables():
    """
    Drop Database Tables
    
    Drops all database tables. Used for testing
    and development environment resets.
    
    ⚠️ WARNING: This will delete all data!
    """
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            logger.info("🗑️ Database tables dropped successfully")
            
    except Exception as e:
        logger.error(f"❌ Failed to drop database tables: {e}")
        raise


async def check_database_connection():
    """
    Check Database Connection
    
    Verifies that the database is accessible and responsive.
    Used for health checks and monitoring.
    
    Returns:
        bool: True if connection is successful
    """
    try:
        async with async_engine.begin() as conn:
            await conn.execute("SELECT 1")
            logger.info("✅ Database connection successful")
            return True
            
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


# Database utility functions
async def reset_database():
    """
    Reset Database
    
    Drops and recreates all tables. Used for development
    and testing environments.
    
    ⚠️ WARNING: This will delete all data!
    """
    if not settings.is_development:
        raise RuntimeError("Database reset is only allowed in development environment")
    
    logger.warning("🔄 Resetting database...")
    await drop_tables()
    await create_tables()
    logger.info("✅ Database reset completed")


# Export database components
__all__ = [
    "Base",
    "async_engine",
    "sync_engine", 
    "AsyncSessionLocal",
    "SessionLocal",
    "get_async_session",
    "get_sync_session",
    "create_tables",
    "drop_tables",
    "check_database_connection",
    "reset_database",
]
