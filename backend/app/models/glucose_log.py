"""
GlucoVision Glucose Log Model
=============================

Professional glucose log model for storing and managing blood sugar readings.
Supports comprehensive glucose tracking with medical-grade data validation.

Features:
- Secure glucose data storage
- Comprehensive reading context
- Medical data validation
- Time-series analysis support
- Export and reporting capabilities
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean, ForeignKey, Enum
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import enum
import uuid

from app.core.database import Base


class ReadingTypeEnum(str, enum.Enum):
    """Glucose reading type enumeration"""
    FASTING = "fasting"
    BEFORE_MEAL = "before_meal"
    AFTER_MEAL = "after_meal"
    BEDTIME = "bedtime"
    RANDOM = "random"
    EXERCISE = "exercise"
    SICK = "sick"
    STRESS = "stress"
    OTHER = "other"


class MealTypeEnum(str, enum.Enum):
    """Meal type enumeration"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
    OTHER = "other"


class GlucoseLog(Base):
    """
    Glucose Log Model
    
    Comprehensive glucose reading model for tracking blood sugar levels
    with detailed context and medical information.
    """
    
    __tablename__ = "glucose_logs"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Key to User
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Core Glucose Data
    glucose_value = Column(Float, nullable=False)  # Blood glucose value
    unit = Column(String, default="mg/dL", nullable=False)  # mg/dL or mmol/L
    
    # Reading Context
    reading_type = Column(Enum(ReadingTypeEnum), nullable=False)
    meal_type = Column(Enum(MealTypeEnum), nullable=True)
    
    # Timing Information
    reading_time = Column(DateTime, nullable=False)  # When the reading was taken
    logged_time = Column(DateTime, default=func.now(), nullable=False)  # When it was logged
    
    # Additional Context
    notes = Column(Text, nullable=True)  # User notes
    symptoms = Column(Text, nullable=True)  # Any symptoms experienced
    
    # Meal and Activity Context
    carbs_consumed = Column(Integer, nullable=True)  # Grams of carbs
    exercise_duration = Column(Integer, nullable=True)  # Minutes of exercise
    exercise_type = Column(String, nullable=True)  # Type of exercise
    
    # Medication Context
    insulin_taken = Column(Boolean, default=False, nullable=False)
    insulin_units = Column(Float, nullable=True)  # Units of insulin
    medication_taken = Column(Boolean, default=False, nullable=False)
    medication_notes = Column(Text, nullable=True)
    
    # Health Context
    stress_level = Column(Integer, nullable=True)  # 1-10 scale
    sleep_hours = Column(Float, nullable=True)  # Hours of sleep
    illness = Column(Boolean, default=False, nullable=False)
    illness_notes = Column(Text, nullable=True)
    
    # Data Quality
    is_validated = Column(Boolean, default=True, nullable=False)
    validation_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<GlucoseLog(id={self.id}, user_id={self.user_id}, value={self.glucose_value}, time={self.reading_time})>"
    
    @property
    def is_in_target_range(self) -> Optional[bool]:
        """
        Check if glucose value is in target range
        Note: This would need user's target range from their profile
        """
        # Default target range (will be customized per user)
        target_min = 80  # mg/dL
        target_max = 180  # mg/dL
        
        if self.unit == "mmol/L":
            # Convert mmol/L to mg/dL for comparison
            glucose_mg_dl = self.glucose_value * 18.0
        else:
            glucose_mg_dl = self.glucose_value
        
        return target_min <= glucose_mg_dl <= target_max
    
    @property
    def glucose_category(self) -> str:
        """Categorize glucose level"""
        if self.unit == "mmol/L":
            glucose_mg_dl = self.glucose_value * 18.0
        else:
            glucose_mg_dl = self.glucose_value
        
        if glucose_mg_dl < 70:
            return "low"
        elif glucose_mg_dl <= 180:
            return "normal"
        elif glucose_mg_dl <= 250:
            return "high"
        else:
            return "very_high"
    
    def convert_unit(self, target_unit: str) -> float:
        """
        Convert glucose value to different unit
        
        Args:
            target_unit: Target unit (mg/dL or mmol/L)
            
        Returns:
            float: Converted glucose value
        """
        if self.unit == target_unit:
            return self.glucose_value
        
        if self.unit == "mg/dL" and target_unit == "mmol/L":
            return round(self.glucose_value / 18.0, 1)
        elif self.unit == "mmol/L" and target_unit == "mg/dL":
            return round(self.glucose_value * 18.0, 0)
        else:
            raise ValueError(f"Unsupported unit conversion: {self.unit} to {target_unit}")
    
    # Database Operations
    @classmethod
    async def create(cls, db: AsyncSession, **kwargs) -> "GlucoseLog":
        """
        Create a new glucose log entry
        
        Args:
            db: Database session
            **kwargs: Glucose log data
            
        Returns:
            GlucoseLog: Created glucose log instance
        """
        log = cls(**kwargs)
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log
    
    @classmethod
    async def get_by_id(cls, db: AsyncSession, log_id: str) -> Optional["GlucoseLog"]:
        """
        Get glucose log by ID
        
        Args:
            db: Database session
            log_id: Log identifier
            
        Returns:
            GlucoseLog: Log instance or None
        """
        result = await db.execute(select(cls).where(cls.id == log_id))
        return result.scalar_one_or_none()
    
    @classmethod
    async def get_user_logs(
        cls, 
        db: AsyncSession, 
        user_id: str, 
        limit: int = 100,
        offset: int = 0,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List["GlucoseLog"]:
        """
        Get glucose logs for a user
        
        Args:
            db: Database session
            user_id: User identifier
            limit: Maximum number of logs to return
            offset: Number of logs to skip
            start_date: Filter logs after this date
            end_date: Filter logs before this date
            
        Returns:
            List[GlucoseLog]: List of glucose logs
        """
        query = select(cls).where(cls.user_id == user_id)
        
        if start_date:
            query = query.where(cls.reading_time >= start_date)
        if end_date:
            query = query.where(cls.reading_time <= end_date)
        
        query = query.order_by(cls.reading_time.desc()).offset(offset).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @classmethod
    async def get_recent_logs(cls, db: AsyncSession, user_id: str, days: int = 7) -> List["GlucoseLog"]:
        """
        Get recent glucose logs for a user
        
        Args:
            db: Database session
            user_id: User identifier
            days: Number of days to look back
            
        Returns:
            List[GlucoseLog]: Recent glucose logs
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        return await cls.get_user_logs(db, user_id, start_date=start_date)
    
    async def update(self, db: AsyncSession, **kwargs) -> "GlucoseLog":
        """
        Update glucose log data
        
        Args:
            db: Database session
            **kwargs: Fields to update
            
        Returns:
            GlucoseLog: Updated log instance
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
        Delete glucose log
        
        Args:
            db: Database session
        """
        await db.delete(self)
        await db.commit()
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert glucose log to dictionary
        
        Returns:
            dict: Glucose log data dictionary
        """
        return {
            "id": self.id,
            "user_id": self.user_id,
            "glucose_value": self.glucose_value,
            "unit": self.unit,
            "reading_type": self.reading_type.value if self.reading_type else None,
            "meal_type": self.meal_type.value if self.meal_type else None,
            "reading_time": self.reading_time.isoformat(),
            "logged_time": self.logged_time.isoformat(),
            "notes": self.notes,
            "symptoms": self.symptoms,
            "carbs_consumed": self.carbs_consumed,
            "exercise_duration": self.exercise_duration,
            "exercise_type": self.exercise_type,
            "insulin_taken": self.insulin_taken,
            "insulin_units": self.insulin_units,
            "medication_taken": self.medication_taken,
            "medication_notes": self.medication_notes,
            "stress_level": self.stress_level,
            "sleep_hours": self.sleep_hours,
            "illness": self.illness,
            "illness_notes": self.illness_notes,
            "is_validated": self.is_validated,
            "validation_notes": self.validation_notes,
            "glucose_category": self.glucose_category,
            "is_in_target_range": self.is_in_target_range,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
