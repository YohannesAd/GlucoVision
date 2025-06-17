"""
GlucoVision Password Reset Token Model
=====================================

Professional password reset token model for secure password recovery.
Handles temporary tokens for password reset verification.

Features:
- Secure token generation and validation
- Expiration time management
- User association and verification
- Professional security compliance
"""

from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from typing import Optional
import uuid
import secrets

from app.core.database import Base


class PasswordResetToken(Base):
    """
    Password Reset Token Model
    
    Stores temporary tokens for password reset verification.
    Provides secure token management with expiration.
    """
    
    __tablename__ = "password_reset_tokens"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Key to User
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Token Data
    token = Column(String, nullable=False, unique=True, index=True)
    verification_code = Column(String, nullable=False)  # 6-digit code for user
    
    # Status and Timing
    is_used = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    used_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<PasswordResetToken(id={self.id}, user_id={self.user_id}, expires_at={self.expires_at})>"
    
    @property
    def is_expired(self) -> bool:
        """Check if token has expired"""
        return datetime.utcnow() > self.expires_at
    
    @property
    def is_valid(self) -> bool:
        """Check if token is valid (not used and not expired)"""
        return not self.is_used and not self.is_expired
    
    def mark_as_used(self) -> None:
        """Mark token as used"""
        self.is_used = True
        self.used_at = datetime.utcnow()
    
    # Database Operations
    @classmethod
    async def create_for_user(cls, db: AsyncSession, user_id: str, expires_minutes: int = 15) -> "PasswordResetToken":
        """
        Create a new password reset token for a user
        
        Args:
            db: Database session
            user_id: User identifier
            expires_minutes: Token expiration time in minutes
            
        Returns:
            PasswordResetToken: Created token instance
        """
        # Generate secure token and verification code
        token = secrets.token_urlsafe(32)
        verification_code = f"{secrets.randbelow(900000) + 100000:06d}"  # 6-digit code
        
        # Calculate expiration time
        expires_at = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        # Create token
        reset_token = cls(
            user_id=user_id,
            token=token,
            verification_code=verification_code,
            expires_at=expires_at
        )
        
        db.add(reset_token)
        await db.commit()
        await db.refresh(reset_token)
        
        return reset_token
    
    @classmethod
    async def get_by_token(cls, db: AsyncSession, token: str) -> Optional["PasswordResetToken"]:
        """
        Get password reset token by token string
        
        Args:
            db: Database session
            token: Token string
            
        Returns:
            PasswordResetToken: Token instance or None
        """
        result = await db.execute(select(cls).where(cls.token == token))
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_by_verification_code(cls, db: AsyncSession, user_id: str, code: str) -> Optional["PasswordResetToken"]:
        """
        Get password reset token by verification code
        
        Args:
            db: Database session
            user_id: User identifier
            code: Verification code
            
        Returns:
            PasswordResetToken: Token instance or None
        """
        result = await db.execute(
            select(cls).where(
                cls.user_id == user_id,
                cls.verification_code == code,
                cls.is_used == False
            )
        )
        return result.scalar_one_or_none()
    
    @classmethod
    async def invalidate_user_tokens(cls, db: AsyncSession, user_id: str) -> None:
        """
        Invalidate all existing tokens for a user
        
        Args:
            db: Database session
            user_id: User identifier
        """
        # Mark all existing tokens as used
        result = await db.execute(
            select(cls).where(
                cls.user_id == user_id,
                cls.is_used == False
            )
        )
        tokens = result.scalars().all()
        
        for token in tokens:
            token.mark_as_used()
        
        await db.commit()
    
    async def delete(self, db: AsyncSession) -> None:
        """
        Delete password reset token
        
        Args:
            db: Database session
        """
        await db.delete(self)
        await db.commit()
    
    def to_dict(self) -> dict:
        """
        Convert token to dictionary (excluding sensitive data)
        
        Returns:
            dict: Token data dictionary
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "is_used": self.is_used,
            "is_expired": self.is_expired,
            "is_valid": self.is_valid,
            "expires_at": self.expires_at.isoformat(),
            "created_at": self.created_at.isoformat(),
            "used_at": self.used_at.isoformat() if self.used_at else None,
        }
