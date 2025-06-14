"""
GlucoVision Security Module
===========================

Professional security implementation with JWT authentication,
password hashing, and medical-grade data protection.

Features:
- JWT token generation and validation
- Secure password hashing with bcrypt
- User authentication and authorization
- Medical data access controls
- Security utilities and helpers
"""

from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.core.config import settings
from app.core.database import get_async_session
from app.DatabaseModels.user import User
from app.schemas.auth import TokenData

# Configure logging
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer token scheme
security = HTTPBearer()

# JWT Algorithm
ALGORITHM = "HS256"


class SecurityManager:
    """
    Professional Security Manager
    
    Handles all security-related operations including:
    - Password hashing and verification
    - JWT token generation and validation
    - User authentication and authorization
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt
        
        Args:
            password: Plain text password
            
        Returns:
            str: Hashed password
        """
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash
        
        Args:
            plain_password: Plain text password
            hashed_password: Stored password hash
            
        Returns:
            bool: True if password matches
        """
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create JWT access token
        
        Args:
            data: Token payload data
            expires_delta: Custom expiration time
            
        Returns:
            str: JWT access token
        """
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict) -> str:
        """
        Create JWT refresh token
        
        Args:
            data: Token payload data
            
        Returns:
            str: JWT refresh token
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        to_encode.update({"exp": expire, "type": "refresh"})
        
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Optional[TokenData]:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token string
            token_type: Expected token type ("access" or "refresh")
            
        Returns:
            TokenData: Decoded token data or None if invalid
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
            
            # Verify token type
            if payload.get("type") != token_type:
                return None
            
            # Extract user information
            user_id: str = payload.get("sub")
            if user_id is None:
                return None
            
            return TokenData(user_id=user_id, token_type=token_type)
            
        except JWTError as e:
            logger.warning(f"JWT verification failed: {e}")
            return None


# Create security manager instance
security_manager = SecurityManager()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_session)
) -> User:
    """
    Get Current Authenticated User
    
    FastAPI dependency that extracts and validates the current user
    from the JWT token in the Authorization header.
    
    Args:
        credentials: HTTP Bearer token credentials
        db: Database session
        
    Returns:
        User: Current authenticated user
        
    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Extract token from credentials
        token = credentials.credentials
        
        # Verify token
        token_data = security_manager.verify_token(token, "access")
        if token_data is None:
            raise credentials_exception
        
        # Get user from database
        user = await User.get_by_id(db, token_data.user_id)
        if user is None:
            raise credentials_exception
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user"
            )
        
        return user
        
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise credentials_exception


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get Current Active User
    
    Additional security layer that ensures the user is active.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User: Current active user
        
    Raises:
        HTTPException: If user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def verify_refresh_token(
    token: str,
    db: AsyncSession = Depends(get_async_session)
) -> User:
    """
    Verify Refresh Token
    
    Validates a refresh token and returns the associated user.
    
    Args:
        token: JWT refresh token
        db: Database session
        
    Returns:
        User: User associated with the refresh token
        
    Raises:
        HTTPException: If token is invalid
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify refresh token
        token_data = security_manager.verify_token(token, "refresh")
        if token_data is None:
            raise credentials_exception
        
        # Get user from database
        user = await User.get_by_id(db, token_data.user_id)
        if user is None:
            raise credentials_exception
        
        return user
        
    except Exception as e:
        logger.error(f"Refresh token verification error: {e}")
        raise credentials_exception


# Security utility functions
def generate_user_tokens(user_id: str) -> dict:
    """
    Generate access and refresh tokens for a user
    
    Args:
        user_id: User identifier
        
    Returns:
        dict: Dictionary containing access and refresh tokens
    """
    access_token = security_manager.create_access_token(data={"sub": str(user_id)})
    refresh_token = security_manager.create_refresh_token(data={"sub": str(user_id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds
    }


# Export security components
__all__ = [
    "SecurityManager",
    "security_manager",
    "get_current_user",
    "get_current_active_user",
    "verify_refresh_token",
    "generate_user_tokens",
]
