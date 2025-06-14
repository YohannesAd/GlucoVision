"""
GlucoVision User Model
======================

Professional user model with medical data support.
Handles user authentication, profile management, and onboarding data.

Features:
- Secure user authentication
- Medical profile information
- Onboarding data storage
- Privacy and security compliance
- Comprehensive user management
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, JSON
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, Dict, Any
import enum
import uuid

from app.core.database import Base


class GenderEnum(str, enum.Enum):
    """Gender enumeration for user profiles"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class DiabetesTypeEnum(str, enum.Enum):
    """Diabetes type enumeration"""
    TYPE1 = "type1"
    TYPE2 = "type2"
    GESTATIONAL = "gestational"
    OTHER = "other"


class User(Base):
    """
    User Model
    
    Comprehensive user model for the GlucoVision application.
    Stores authentication data, profile information, and medical details.
    """
    
    __tablename__ = "users"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Authentication Fields
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Profile Information
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(Enum(GenderEnum), nullable=True)
    
    # Medical Information
    diabetes_type = Column(Enum(DiabetesTypeEnum), nullable=True)
    diagnosis_date = Column(DateTime, nullable=True)
    current_medications = Column(JSON, nullable=True)  # List of medications
    allergies = Column(JSON, nullable=True)  # List of allergies
    
    # App Preferences
    preferred_unit = Column(String, default="mg/dL", nullable=False)  # mg/dL or mmol/L
    target_range_min = Column(Integer, default=80, nullable=False)
    target_range_max = Column(Integer, default=180, nullable=False)
    reminder_times = Column(JSON, nullable=True)  # List of reminder times
    
    # Onboarding Status
    has_completed_onboarding = Column(Boolean, default=False, nullable=False)
    onboarding_step = Column(Integer, default=0, nullable=False)
    
    # Additional Medical Data (from onboarding)
    meals_per_day = Column(Integer, nullable=True)
    activity_level = Column(String, nullable=True)  # low, moderate, high
    uses_insulin = Column(Boolean, nullable=True)
    sleep_duration = Column(Integer, nullable=True)  # hours
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Privacy and Security
    privacy_settings = Column(JSON, nullable=True)
    notification_preferences = Column(JSON, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.first_name} {self.last_name})>"
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return "User"
    
    @property
    def is_onboarded(self) -> bool:
        """Check if user has completed onboarding"""
        return self.has_completed_onboarding
    
    def set_password(self, password: str) -> None:
        """Set user password with secure hashing"""
        from app.core.security import security_manager
        self.hashed_password = security_manager.hash_password(password)

    def verify_password(self, password: str) -> bool:
        """Verify user password"""
        from app.core.security import security_manager
        return security_manager.verify_password(password, self.hashed_password)
    
    def update_last_login(self) -> None:
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
    
    def complete_onboarding(self) -> None:
        """Mark onboarding as completed"""
        self.has_completed_onboarding = True
        self.onboarding_step = 3  # Assuming 3 steps
    
    # Database Operations
    @classmethod
    async def create(cls, db: AsyncSession, **kwargs) -> "User":
        """
        Create a new user
        
        Args:
            db: Database session
            **kwargs: User data
            
        Returns:
            User: Created user instance
        """
        user = cls(**kwargs)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, user_id: str) -> Optional["User"]:
        """
        Get user by ID
        
        Args:
            db: Database session
            user_id: User identifier
            
        Returns:
            User: User instance or None
        """
        result = await db.execute(select(cls).where(cls.id == user_id))
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_by_email(cls, db: AsyncSession, email: str) -> Optional["User"]:
        """
        Get user by email
        
        Args:
            db: Database session
            email: User email address
            
        Returns:
            User: User instance or None
        """
        result = await db.execute(select(cls).where(cls.email == email))
        return result.scalar_one_or_none()
    
    async def update(self, db: AsyncSession, **kwargs) -> "User":
        """
        Update user data
        
        Args:
            db: Database session
            **kwargs: Fields to update
            
        Returns:
            User: Updated user instance
        """
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        self.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(self)
        return self
    
    async def delete(self, db: AsyncSession) -> None:
        """
        Delete user (soft delete by deactivating)
        
        Args:
            db: Database session
        """
        self.is_active = False
        self.updated_at = datetime.utcnow()
        await db.commit()
    
    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """
        Convert user to dictionary
        
        Args:
            include_sensitive: Whether to include sensitive data
            
        Returns:
            dict: User data dictionary
        """
        data = {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": self.full_name,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "gender": self.gender.value if self.gender else None,
            "diabetes_type": self.diabetes_type.value if self.diabetes_type else None,
            "preferred_unit": self.preferred_unit,
            "target_range_min": self.target_range_min,
            "target_range_max": self.target_range_max,
            "has_completed_onboarding": self.has_completed_onboarding,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }
        
        if include_sensitive:
            data.update({
                "current_medications": self.current_medications,
                "allergies": self.allergies,
                "meals_per_day": self.meals_per_day,
                "activity_level": self.activity_level,
                "uses_insulin": self.uses_insulin,
                "sleep_duration": self.sleep_duration,
                "reminder_times": self.reminder_times,
                "privacy_settings": self.privacy_settings,
                "notification_preferences": self.notification_preferences,
            })
        
        return data
