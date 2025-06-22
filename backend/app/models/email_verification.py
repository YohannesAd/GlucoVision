"""
GlucoVision Email Verification Token Model
==========================================

Professional email verification model for secure user registration.
Handles email verification tokens and user account activation.

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


class EmailVerificationToken(Base):
    """
    Email Verification Token Model
    
    Stores tokens for email verification during user registration.
    Provides secure token management with expiration.
    """
    
    __tablename__ = "email_verification_tokens"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Key to User
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Token Data
    token = Column(String, nullable=False, unique=True, index=True)
    
    # Status and Timing
    is_used = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    used_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<EmailVerificationToken(id={self.id}, user_id={self.user_id}, expires_at={self.expires_at})>"
    
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
    async def create_for_user(cls, db: AsyncSession, user_id: str, expires_hours: int = 24) -> "EmailVerificationToken":
        """
        Create a new email verification token for a user
        
        Args:
            db: Database session
            user_id: User identifier
            expires_hours: Token expiration time in hours
            
        Returns:
            EmailVerificationToken: Created token instance
        """
        # Generate secure token
        token = secrets.token_urlsafe(32)
        
        # Calculate expiration time
        expires_at = datetime.utcnow() + timedelta(hours=expires_hours)
        
        # Create token
        verification_token = cls(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )
        
        db.add(verification_token)
        await db.commit()
        await db.refresh(verification_token)
        
        return verification_token
    
    @classmethod
    async def get_by_token(cls, db: AsyncSession, token: str) -> Optional["EmailVerificationToken"]:
        """
        Get email verification token by token string
        
        Args:
            db: Database session
            token: Token string
            
        Returns:
            EmailVerificationToken or None
        """
        result = await db.execute(
            select(cls).where(cls.token == token)
        )
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_valid_token(cls, db: AsyncSession, token: str) -> Optional["EmailVerificationToken"]:
        """
        Get valid (not used and not expired) token
        
        Args:
            db: Database session
            token: Token string
            
        Returns:
            EmailVerificationToken or None if invalid/expired
        """
        verification_token = await cls.get_by_token(db, token)
        if verification_token and verification_token.is_valid:
            return verification_token
        return None
    
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
        Delete email verification token
        
        Args:
            db: Database session
        """
        await db.delete(self)
        await db.commit()
    
    @classmethod
    async def cleanup_expired_tokens(cls, db: AsyncSession) -> int:
        """
        Clean up expired tokens from database
        
        Args:
            db: Database session
            
        Returns:
            int: Number of tokens deleted
        """
        # Get expired tokens
        result = await db.execute(
            select(cls).where(cls.expires_at < datetime.utcnow())
        )
        expired_tokens = result.scalars().all()
        
        # Delete expired tokens
        for token in expired_tokens:
            await db.delete(token)
        
        await db.commit()
        return len(expired_tokens)
