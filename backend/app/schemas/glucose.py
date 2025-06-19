"""
GlucoVision Glucose Schemas
===========================

Pydantic schemas for glucose data management and validation.
Provides comprehensive glucose tracking with medical-grade validation.

Features:
- Glucose log creation and updates
- Medical data validation
- Export and filtering options
- Professional data structures
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, timedelta
from enum import Enum


class ReadingTypeEnum(str, Enum):
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


class MealTypeEnum(str, Enum):
    """Meal type enumeration"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"
    OTHER = "other"


class GlucoseLogCreate(BaseModel):
    """Schema for creating a new glucose log entry"""
    glucose_value: float = Field(..., ge=20, le=600, description="Glucose value (20-600)")
    unit: str = Field(default="mg/dL", pattern="^(mg/dL|mmol/L)$", description="Glucose unit")
    reading_type: ReadingTypeEnum = Field(..., description="Type of glucose reading")
    meal_type: Optional[MealTypeEnum] = Field(None, description="Related meal type")
    reading_time: datetime = Field(..., description="When the reading was taken")
    
    # Optional context information
    notes: Optional[str] = Field(None, max_length=500, description="User notes")
    symptoms: Optional[str] = Field(None, max_length=300, description="Any symptoms")
    carbs_consumed: Optional[int] = Field(None, ge=0, le=500, description="Carbs in grams")
    exercise_duration: Optional[int] = Field(None, ge=0, le=480, description="Exercise minutes")
    exercise_type: Optional[str] = Field(None, max_length=100, description="Type of exercise")
    
    # Medication context
    insulin_taken: bool = Field(default=False, description="Insulin taken")
    insulin_units: Optional[float] = Field(None, ge=0, le=100, description="Insulin units")
    medication_taken: bool = Field(default=False, description="Medication taken")
    medication_notes: Optional[str] = Field(None, max_length=200, description="Medication notes")
    
    # Health context
    stress_level: Optional[int] = Field(None, ge=1, le=10, description="Stress level (1-10)")
    sleep_hours: Optional[float] = Field(None, ge=0, le=24, description="Sleep hours")
    illness: bool = Field(default=False, description="Feeling ill")
    illness_notes: Optional[str] = Field(None, max_length=200, description="Illness details")
    
    @validator("glucose_value")
    def validate_glucose_value(cls, v, values):
        """Validate glucose value based on unit"""
        unit = values.get("unit", "mg/dL")
        if unit == "mg/dL":
            if v < 20 or v > 600:
                raise ValueError("Glucose value must be between 20-600 mg/dL")
        elif unit == "mmol/L":
            if v < 1.1 or v > 33.3:
                raise ValueError("Glucose value must be between 1.1-33.3 mmol/L")
        return v
    
    @validator("reading_time")
    def validate_reading_time(cls, v):
        """Validate reading time is not in the future"""
        from datetime import timezone

        # Get current UTC time
        now_utc = datetime.utcnow()

        # Convert input to UTC for comparison
        if v.tzinfo is not None:
            # If timezone-aware, convert to UTC
            v_utc = v.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            # If timezone-naive, assume it's already in UTC
            v_utc = v

        # Add a small buffer (5 minutes) to account for clock differences
        buffer_minutes = 5
        future_threshold = now_utc + timedelta(minutes=buffer_minutes)

        # Compare with current UTC time plus buffer
        if v_utc > future_threshold:
            raise ValueError("Reading time cannot be in the future")
        return v
    
    @validator("insulin_units")
    def validate_insulin_units(cls, v, values):
        """Validate insulin units when insulin is taken"""
        if values.get("insulin_taken") and v is None:
            raise ValueError("Insulin units required when insulin is taken")
        if not values.get("insulin_taken") and v is not None:
            raise ValueError("Insulin units should not be provided when insulin is not taken")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "glucose_value": 120,
                "unit": "mg/dL",
                "reading_type": "fasting",
                "meal_type": None,
                "reading_time": "2024-01-15T08:00:00",
                "notes": "Feeling good this morning",
                "symptoms": None,
                "carbs_consumed": None,
                "exercise_duration": 30,
                "exercise_type": "walking",
                "insulin_taken": False,
                "insulin_units": None,
                "medication_taken": True,
                "medication_notes": "Took metformin",
                "stress_level": 3,
                "sleep_hours": 8.0,
                "illness": False,
                "illness_notes": None
            }
        }


class GlucoseLogUpdate(BaseModel):
    """Schema for updating an existing glucose log entry"""
    glucose_value: Optional[float] = Field(None, ge=20, le=600)
    reading_type: Optional[ReadingTypeEnum] = None
    meal_type: Optional[MealTypeEnum] = None
    reading_time: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=500)
    symptoms: Optional[str] = Field(None, max_length=300)
    carbs_consumed: Optional[int] = Field(None, ge=0, le=500)
    exercise_duration: Optional[int] = Field(None, ge=0, le=480)
    exercise_type: Optional[str] = Field(None, max_length=100)
    insulin_taken: Optional[bool] = None
    insulin_units: Optional[float] = Field(None, ge=0, le=100)
    medication_taken: Optional[bool] = None
    medication_notes: Optional[str] = Field(None, max_length=200)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    illness: Optional[bool] = None
    illness_notes: Optional[str] = Field(None, max_length=200)


class GlucoseLogResponse(BaseModel):
    """Schema for glucose log response"""
    id: str
    user_id: str
    glucose_value: float
    unit: str
    reading_type: str
    meal_type: Optional[str]
    reading_time: str
    logged_time: str
    notes: Optional[str]
    symptoms: Optional[str]
    carbs_consumed: Optional[int]
    exercise_duration: Optional[int]
    exercise_type: Optional[str]
    insulin_taken: bool
    insulin_units: Optional[float]
    medication_taken: bool
    medication_notes: Optional[str]
    stress_level: Optional[int]
    sleep_hours: Optional[float]
    illness: bool
    illness_notes: Optional[str]
    is_validated: bool
    validation_notes: Optional[str]
    glucose_category: str
    is_in_target_range: Optional[bool]
    created_at: str
    updated_at: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "log-uuid-here",
                "user_id": "user-uuid-here",
                "glucose_value": 120,
                "unit": "mg/dL",
                "reading_type": "fasting",
                "meal_type": None,
                "reading_time": "2024-01-15T08:00:00",
                "logged_time": "2024-01-15T08:05:00",
                "notes": "Feeling good this morning",
                "symptoms": None,
                "carbs_consumed": None,
                "exercise_duration": 30,
                "exercise_type": "walking",
                "insulin_taken": False,
                "insulin_units": None,
                "medication_taken": True,
                "medication_notes": "Took metformin",
                "stress_level": 3,
                "sleep_hours": 8.0,
                "illness": False,
                "illness_notes": None,
                "is_validated": True,
                "validation_notes": None,
                "glucose_category": "normal",
                "is_in_target_range": True,
                "created_at": "2024-01-15T08:05:00",
                "updated_at": "2024-01-15T08:05:00"
            }
        }


class GlucoseLogListResponse(BaseModel):
    """Schema for glucose log list response"""
    logs: List[GlucoseLogResponse]
    total_count: int
    page: int
    page_size: int
    has_next: bool
    has_previous: bool
    
    class Config:
        json_schema_extra = {
            "example": {
                "logs": [],
                "total_count": 25,
                "page": 1,
                "page_size": 10,
                "has_next": True,
                "has_previous": False
            }
        }


class GlucoseStatsResponse(BaseModel):
    """Schema for glucose statistics response"""
    total_readings: int
    average_glucose: float
    min_glucose: float
    max_glucose: float
    readings_in_range: int
    readings_below_range: int
    readings_above_range: int
    time_in_range_percentage: float
    last_reading: Optional[GlucoseLogResponse]
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_readings": 50,
                "average_glucose": 135.5,
                "min_glucose": 85,
                "max_glucose": 220,
                "readings_in_range": 35,
                "readings_below_range": 3,
                "readings_above_range": 12,
                "time_in_range_percentage": 70.0,
                "last_reading": None
            }
        }
