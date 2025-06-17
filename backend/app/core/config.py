"""
GlucoVision Backend Configuration
=================================

Professional configuration management using Pydantic Settings.
Handles environment variables, security settings, and database configuration.

Features:
- Environment-based configuration
- Secure secret management
- Database connection settings
- CORS and security policies
- AI/ML model configuration
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """
    Application Settings
    
    Manages all configuration through environment variables
    with secure defaults and validation.
    """
    
    # Application Settings
    APP_NAME: str = "GlucoVision API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # Security Settings
    SECRET_KEY: str = Field(
        default="your-super-secret-key-change-in-production",
        env="SECRET_KEY",
        description="JWT secret key - MUST be changed in production"
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    
    # Database Settings
    DATABASE_URL: str = Field(
        default="postgresql://postgres:password@localhost:5432/glucovision",
        env="DATABASE_URL",
        description="PostgreSQL database connection string"
    )
    
    # Development SQLite fallback
    SQLITE_URL: str = Field(
        default="sqlite:///./glucovision.db",
        env="SQLITE_URL"
    )
    
    # Use SQLite in development if PostgreSQL not available
    USE_SQLITE: bool = Field(default=False, env="USE_SQLITE")
    
    # CORS Settings - Allow React Native development
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8081",     # Expo default
            "http://localhost:19006",    # Expo web
            "exp://localhost:19000",     # Expo app
            "http://10.0.0.226:*",       # Your computer's IP
            "http://192.168.*.*:*",      # Local network ranges
            "http://10.0.*.*:*",         # Local network ranges
            "*",                         # Allow all origins in development
        ],
        env="CORS_ORIGINS"
    )
    
    # Trusted Hosts
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1", "10.0.0.226", "*.railway.app"],
        env="ALLOWED_HOSTS"
    )
    
    # File Upload Settings
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, env="MAX_FILE_SIZE")  # 10MB
    UPLOAD_DIR: str = Field(default="uploads", env="UPLOAD_DIR")
    
    # AI/ML Settings
    AI_MODEL_PATH: str = Field(default="MlModels", env="AI_MODEL_PATH")
    ENABLE_AI_INSIGHTS: bool = Field(default=True, env="ENABLE_AI_INSIGHTS")
    MIN_LOGS_FOR_AI: int = Field(default=4, env="MIN_LOGS_FOR_AI")

    # OpenAI Configuration
    OPENAI_API_KEY: str = Field(default="", env="OPENAI_API_KEY")
    OPENAI_MODEL: str = Field(default="gpt-4", env="OPENAI_MODEL")
    OPENAI_MAX_TOKENS: int = Field(default=1000, env="OPENAI_MAX_TOKENS")
    OPENAI_TEMPERATURE: float = Field(default=0.7, env="OPENAI_TEMPERATURE")
    ENABLE_OPENAI_CHAT: bool = Field(default=True, env="ENABLE_OPENAI_CHAT")
    
    # Email Settings (for notifications)
    SMTP_HOST: Optional[str] = Field(default=None, env="SMTP_HOST")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USERNAME: Optional[str] = Field(default=None, env="SMTP_USERNAME")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    
    # Redis Settings (for caching)
    REDIS_URL: Optional[str] = Field(default=None, env="REDIS_URL")
    
    # Monitoring & Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    ENABLE_METRICS: bool = Field(default=True, env="ENABLE_METRICS")
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Validate environment setting"""
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"Environment must be one of: {allowed}")
        return v
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v or []

    @validator("ALLOWED_HOSTS", pre=True)
    def parse_allowed_hosts(cls, v):
        """Parse allowed hosts from string or list"""
        if isinstance(v, str):
            return [host.strip() for host in v.split(",") if host.strip()]
        return v or []
    
    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL"""
        if self.USE_SQLITE:
            return self.SQLITE_URL
        return self.DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")
    
    @property
    def database_url_async(self) -> str:
        """Get asynchronous database URL"""
        if self.USE_SQLITE:
            return self.SQLITE_URL.replace("sqlite://", "sqlite+aiosqlite://")
        return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.ENVIRONMENT == "development"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create global settings instance
settings = Settings()


# Development helper functions
def get_database_url() -> str:
    """
    Get the appropriate database URL based on environment
    
    Returns:
        str: Database connection string
    """
    return settings.database_url_sync


def create_upload_dir():
    """Create upload directory if it doesn't exist"""
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(exist_ok=True)
    return upload_path


def create_model_dir():
    """Create AI model directory if it doesn't exist"""
    model_path = Path(settings.AI_MODEL_PATH)
    model_path.mkdir(exist_ok=True)
    return model_path


# Initialize directories
if settings.is_development:
    create_upload_dir()
    create_model_dir()


# Export settings for easy import
__all__ = ["settings", "get_database_url", "create_upload_dir", "create_model_dir"]
