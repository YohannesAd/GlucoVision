"""
GlucoVision User Schemas
========================

Pydantic schemas for user management and profile operations.
Provides data validation and serialization for user endpoints.

Features:
- User profile management
- Onboarding data validation
- Medical information schemas
- Privacy and security compliance
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


class GenderEnum(str, Enum):
    """Gender enumeration"""
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class DiabetesTypeEnum(str, Enum):
    """Diabetes type enumeration"""
    TYPE1 = "type1"
    TYPE2 = "type2"
    GESTATIONAL = "gestational"
    OTHER = "other"


class ActivityLevelEnum(str, Enum):
    """Activity level enumeration"""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"


class UserProfileUpdate(BaseModel):
    """User profile update schema"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    date_of_birth: Optional[date] = None
    gender: Optional[GenderEnum] = None
    preferred_unit: Optional[str] = Field(None, pattern="^(mg/dL|mmol/L)$")
    target_range_min: Optional[int] = Field(None, ge=50, le=200)
    target_range_max: Optional[int] = Field(None, ge=100, le=400)
    
    @validator("target_range_max")
    def validate_target_range(cls, v, values):
        """Validate that max is greater than min"""
        if "target_range_min" in values and values["target_range_min"] and v:
            if v <= values["target_range_min"]:
                raise ValueError("Target range max must be greater than min")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "date_of_birth": "1990-01-15",
                "gender": "male",
                "preferred_unit": "mg/dL",
                "target_range_min": 80,
                "target_range_max": 180
            }
        }


class OnboardingStep1(BaseModel):
    """Onboarding Step 1: Personal Information"""
    date_of_birth: date = Field(..., description="Date of birth")
    gender: GenderEnum = Field(..., description="Gender")
    diabetes_type: DiabetesTypeEnum = Field(..., description="Type of diabetes")
    diagnosis_date: date = Field(..., description="Date of diabetes diagnosis")
    
    @validator("date_of_birth")
    def validate_age(cls, v):
        """Validate reasonable age range"""
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 1 or age > 120:
            raise ValueError("Please enter a valid date of birth")
        return v
    
    @validator("diagnosis_date")
    def validate_diagnosis_date(cls, v, values):
        """Validate diagnosis date is after birth and not in future"""
        if v > date.today():
            raise ValueError("Diagnosis date cannot be in the future")
        if "date_of_birth" in values and v < values["date_of_birth"]:
            raise ValueError("Diagnosis date cannot be before date of birth")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "date_of_birth": "1985-03-15",
                "gender": "male",
                "diabetes_type": "type2",
                "diagnosis_date": "2020-06-01"
            }
        }


class OnboardingStep2(BaseModel):
    """Onboarding Step 2: Medical Information"""
    meals_per_day: int = Field(..., ge=1, le=10, description="Number of meals per day")
    activity_level: ActivityLevelEnum = Field(..., description="Physical activity level")
    uses_insulin: bool = Field(..., description="Whether user takes insulin")
    current_medications: List[str] = Field(default=[], description="List of current medications")
    sleep_duration: int = Field(..., ge=1, le=24, description="Average sleep duration in hours")
    
    class Config:
        json_schema_extra = {
            "example": {
                "meals_per_day": 3,
                "activity_level": "moderate",
                "uses_insulin": False,
                "current_medications": ["Metformin", "Lisinopril"],
                "sleep_duration": 8
            }
        }


class GlucoseReading(BaseModel):
    """Individual glucose reading for onboarding"""
    glucose_value: float = Field(..., ge=20, le=600, description="Glucose value")
    reading_time: datetime = Field(..., description="When the reading was taken")
    reading_type: str = Field(..., description="Type of reading (fasting, after_meal, etc.)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "glucose_value": 120,
                "reading_time": "2024-01-15T08:00:00",
                "reading_type": "fasting"
            }
        }


class OnboardingStep3(BaseModel):
    """Onboarding Step 3: Initial Glucose Logs"""
    glucose_readings: List[GlucoseReading] = Field(
        ..., 
        min_items=4, 
        max_items=4, 
        description="Four recent glucose readings"
    )
    preferred_unit: str = Field(default="mg/dL", pattern="^(mg/dL|mmol/L)$")
    target_range_min: int = Field(default=80, ge=50, le=200)
    target_range_max: int = Field(default=180, ge=100, le=400)
    
    @validator("target_range_max")
    def validate_target_range(cls, v, values):
        """Validate that max is greater than min"""
        if "target_range_min" in values and v <= values["target_range_min"]:
            raise ValueError("Target range max must be greater than min")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "glucose_readings": [
                    {
                        "glucose_value": 95,
                        "reading_time": "2024-01-15T08:00:00",
                        "reading_type": "fasting"
                    },
                    {
                        "glucose_value": 140,
                        "reading_time": "2024-01-15T14:00:00",
                        "reading_type": "after_meal"
                    },
                    {
                        "glucose_value": 110,
                        "reading_time": "2024-01-16T08:00:00",
                        "reading_type": "fasting"
                    },
                    {
                        "glucose_value": 160,
                        "reading_time": "2024-01-16T20:00:00",
                        "reading_type": "after_meal"
                    }
                ],
                "preferred_unit": "mg/dL",
                "target_range_min": 80,
                "target_range_max": 180
            }
        }


class UserResponse(BaseModel):
    """User response schema"""
    id: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    full_name: str
    date_of_birth: Optional[str]
    gender: Optional[str]
    diabetes_type: Optional[str]
    preferred_unit: str
    target_range_min: int
    target_range_max: int
    has_completed_onboarding: bool
    is_active: bool
    is_verified: bool
    created_at: str
    updated_at: str
    last_login: Optional[str]
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "user-uuid-here",
                "email": "user@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "full_name": "John Doe",
                "date_of_birth": "1985-03-15",
                "gender": "male",
                "diabetes_type": "type2",
                "preferred_unit": "mg/dL",
                "target_range_min": 80,
                "target_range_max": 180,
                "has_completed_onboarding": True,
                "is_active": True,
                "is_verified": True,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-15T12:00:00",
                "last_login": "2024-01-15T12:00:00"
            }
        }


class OnboardingStatusResponse(BaseModel):
    """Onboarding status response"""
    has_completed_onboarding: bool
    current_step: int
    total_steps: int = 3
    next_step: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "has_completed_onboarding": False,
                "current_step": 1,
                "total_steps": 3,
                "next_step": "personal_information"
            }
        }
