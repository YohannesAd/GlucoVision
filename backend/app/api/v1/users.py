"""
GlucoVision User Management Endpoints
=====================================

Professional user management API endpoints for profile and onboarding.
Handles user profile updates, onboarding flow, and account management.

Features:
- User profile management
- Multi-step onboarding process
- Medical information handling
- Privacy and security compliance
- Professional data validation
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import logging

from app.core.database import get_async_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.glucose_log import GlucoseLog, ReadingTypeEnum
from app.schemas.user import (
    UserProfileUpdate,
    OnboardingStep1,
    OnboardingStep2, 
    OnboardingStep3,
    UserResponse,
    OnboardingStatusResponse
)

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get User Profile
    
    Returns the current user's complete profile information.
    Includes personal data, medical information, and app preferences.
    
    **Security Features:**
    - JWT authentication required
    - User-specific data access
    - Secure data serialization
    
    **Returns:**
    - Complete user profile information
    - Account status and preferences
    - Onboarding completion status
    """
    try:
        return UserResponse(**current_user.to_dict())
        
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user profile"
        )


@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Update User Profile
    
    Updates the current user's profile information.
    Only provided fields are updated, others remain unchanged.
    
    **Security Features:**
    - JWT authentication required
    - Data validation with Pydantic
    - Secure database updates
    - Input sanitization
    
    **Returns:**
    - Updated user profile information
    - Success confirmation
    """
    try:
        # Prepare update data (only non-None values)
        update_data = {
            key: value for key, value in profile_data.dict().items() 
            if value is not None
        }
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        # Update user profile
        updated_user = await current_user.update(db, **update_data)
        
        logger.info(f"Profile updated for user: {current_user.email}")
        
        return UserResponse(**updated_user.to_dict())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile"
        )


@router.get("/onboarding/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    current_user: User = Depends(get_current_user)
):
    """
    Get Onboarding Status
    
    Returns the current user's onboarding progress and next steps.
    Used by frontend to determine which onboarding screen to show.
    
    **Returns:**
    - Onboarding completion status
    - Current step number
    - Next step information
    """
    try:
        # Determine current step based on completed data
        current_step = 0
        next_step = None
        
        if not current_user.has_completed_onboarding:
            # Check what data is missing to determine current step
            if not all([
                current_user.date_of_birth,
                current_user.gender,
                current_user.diabetes_type,
                current_user.diagnosis_date
            ]):
                current_step = 1
                next_step = "personal_information"
            elif not all([
                current_user.meals_per_day,
                current_user.activity_level,
                current_user.uses_insulin is not None,
                current_user.sleep_duration
            ]):
                current_step = 2
                next_step = "medical_information"
            else:
                current_step = 3
                next_step = "glucose_logs"
        else:
            current_step = 3  # Completed
        
        return OnboardingStatusResponse(
            has_completed_onboarding=current_user.has_completed_onboarding,
            current_step=current_step,
            next_step=next_step
        )
        
    except Exception as e:
        logger.error(f"Get onboarding status error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve onboarding status"
        )


@router.post("/onboarding/step1")
async def complete_onboarding_step1(
    step1_data: OnboardingStep1,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Complete Onboarding Step 1
    
    Saves personal information and medical basics.
    Updates user profile with diabetes type and diagnosis information.
    
    **Data Collected:**
    - Date of birth
    - Gender
    - Diabetes type
    - Diagnosis date
    
    **Returns:**
    - Success confirmation
    - Next step information
    """
    try:
        # Update user with step 1 data
        await current_user.update(
            db,
            date_of_birth=datetime.combine(step1_data.date_of_birth, datetime.min.time()),
            gender=step1_data.gender,
            diabetes_type=step1_data.diabetes_type,
            diagnosis_date=datetime.combine(step1_data.diagnosis_date, datetime.min.time()),
            onboarding_step=1
        )
        
        logger.info(f"Onboarding step 1 completed for user: {current_user.email}")
        
        return {
            "message": "Step 1 completed successfully",
            "next_step": "medical_information",
            "step": 2
        }
        
    except Exception as e:
        logger.error(f"Onboarding step 1 error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete onboarding step 1"
        )


@router.post("/onboarding/step2")
async def complete_onboarding_step2(
    step2_data: OnboardingStep2,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Complete Onboarding Step 2
    
    Saves medical information and lifestyle data.
    Updates user profile with medication and activity information.
    
    **Data Collected:**
    - Meals per day
    - Activity level
    - Insulin usage
    - Current medications
    - Sleep duration
    
    **Returns:**
    - Success confirmation
    - Next step information
    """
    try:
        # Update user with step 2 data
        await current_user.update(
            db,
            meals_per_day=step2_data.meals_per_day,
            activity_level=step2_data.activity_level.value,
            uses_insulin=step2_data.uses_insulin,
            current_medications=step2_data.current_medications,
            sleep_duration=step2_data.sleep_duration,
            onboarding_step=2
        )
        
        logger.info(f"Onboarding step 2 completed for user: {current_user.email}")
        
        return {
            "message": "Step 2 completed successfully",
            "next_step": "glucose_logs",
            "step": 3
        }
        
    except Exception as e:
        logger.error(f"Onboarding step 2 error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete onboarding step 2"
        )


@router.post("/onboarding/step3")
async def complete_onboarding_step3(
    step3_data: OnboardingStep3,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Complete Onboarding Step 3
    
    Saves initial glucose readings and completes onboarding.
    Creates glucose log entries and sets user preferences.
    
    **Data Collected:**
    - Four initial glucose readings
    - Preferred glucose unit
    - Target glucose range
    
    **Returns:**
    - Success confirmation
    - Onboarding completion status
    """
    try:
        # Update user preferences
        await current_user.update(
            db,
            preferred_unit=step3_data.preferred_unit,
            target_range_min=step3_data.target_range_min,
            target_range_max=step3_data.target_range_max,
            onboarding_step=3
        )
        
        # Create glucose log entries
        for reading in step3_data.glucose_readings:
            await GlucoseLog.create(
                db,
                user_id=current_user.id,
                glucose_value=reading.glucose_value,
                unit=step3_data.preferred_unit,
                reading_type=ReadingTypeEnum(reading.reading_type),
                reading_time=reading.reading_time,
                logged_time=datetime.utcnow(),
                is_validated=True
            )
        
        # Mark onboarding as completed
        current_user.complete_onboarding()
        await db.commit()
        
        logger.info(f"Onboarding completed for user: {current_user.email}")
        
        return {
            "message": "Onboarding completed successfully",
            "has_completed_onboarding": True,
            "glucose_logs_created": len(step3_data.glucose_readings)
        }
        
    except Exception as e:
        logger.error(f"Onboarding step 3 error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete onboarding step 3"
        )


@router.delete("/account")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Delete User Account
    
    Deactivates the user account (soft delete).
    Preserves data for medical compliance but prevents access.
    
    **Security Features:**
    - JWT authentication required
    - Soft delete for data retention
    - Audit logging
    - Immediate session invalidation
    
    **Returns:**
    - Account deletion confirmation
    """
    try:
        # Soft delete user account
        await current_user.delete(db)
        
        logger.info(f"Account deleted for user: {current_user.email}")
        
        return {
            "message": "Account deleted successfully",
            "note": "Your data has been deactivated but preserved for medical compliance"
        }
        
    except Exception as e:
        logger.error(f"Account deletion error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account"
        )
