"""
GlucoVision Schemas Package
===========================

Pydantic schemas for request/response validation and serialization.
Provides type safety and data validation for API endpoints.

Schemas:
- auth: Authentication and authorization schemas
- user: User profile and management schemas  
- glucose: Glucose log and data schemas
"""

from app.schemas.auth import (
    UserLogin, UserRegister, Token, TokenData, 
    PasswordResetRequest, PasswordResetConfirm
)
from app.schemas.user import (
    UserResponse, UserProfileUpdate, OnboardingStep1, 
    OnboardingStep2, OnboardingStep3, OnboardingStatusResponse
)
from app.schemas.glucose import (
    GlucoseLogCreate, GlucoseLogResponse, GlucoseLogUpdate,
    GlucoseStatsResponse, GlucoseLogListResponse, ReadingTypeEnum, MealTypeEnum
)

__all__ = [
    # Auth schemas
    "UserLogin",
    "UserRegister", 
    "Token",
    "TokenData",
    "PasswordResetRequest",
    "PasswordResetConfirm",
    
    # User schemas
    "UserResponse",
    "UserProfileUpdate",
    "OnboardingStep1",
    "OnboardingStep2", 
    "OnboardingStep3",
    "OnboardingStatusResponse",
    
    # Glucose schemas
    "GlucoseLogCreate",
    "GlucoseLogResponse",
    "GlucoseLogUpdate",
    "GlucoseStatsResponse",
    "GlucoseLogListResponse",
    "ReadingTypeEnum",
    "MealTypeEnum",
]
