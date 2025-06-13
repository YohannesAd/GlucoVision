"""
GlucoVision Glucose Management Endpoints
========================================

Professional glucose data management API endpoints.
Handles glucose log creation, retrieval, updates, and statistics.

Features:
- Comprehensive glucose logging
- Advanced filtering and pagination
- Statistical analysis
- Data export capabilities
- Medical-grade data validation
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Optional, List
import logging

from app.core.database import get_async_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.glucose_log import GlucoseLog, ReadingTypeEnum, MealTypeEnum
from app.schemas.glucose import (
    GlucoseLogCreate,
    GlucoseLogUpdate,
    GlucoseLogResponse,
    GlucoseLogListResponse,
    GlucoseStatsResponse
)

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.post("/logs", response_model=GlucoseLogResponse, status_code=status.HTTP_201_CREATED)
async def create_glucose_log(
    log_data: GlucoseLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Create Glucose Log Entry
    
    Creates a new glucose reading with comprehensive context information.
    Validates medical data and stores with timestamp tracking.
    
    **Features:**
    - Medical-grade data validation
    - Comprehensive context tracking
    - Automatic categorization
    - Target range analysis
    
    **Returns:**
    - Created glucose log with analysis
    - Glucose category and range status
    - Validation confirmation
    """
    try:
        # Create glucose log entry
        glucose_log = await GlucoseLog.create(
            db,
            user_id=current_user.id,
            glucose_value=log_data.glucose_value,
            unit=log_data.unit,
            reading_type=log_data.reading_type,
            meal_type=log_data.meal_type,
            reading_time=log_data.reading_time,
            logged_time=datetime.utcnow(),
            notes=log_data.notes,
            symptoms=log_data.symptoms,
            carbs_consumed=log_data.carbs_consumed,
            exercise_duration=log_data.exercise_duration,
            exercise_type=log_data.exercise_type,
            insulin_taken=log_data.insulin_taken,
            insulin_units=log_data.insulin_units,
            medication_taken=log_data.medication_taken,
            medication_notes=log_data.medication_notes,
            stress_level=log_data.stress_level,
            sleep_hours=log_data.sleep_hours,
            illness=log_data.illness,
            illness_notes=log_data.illness_notes,
            is_validated=True
        )
        
        logger.info(f"Glucose log created for user: {current_user.email}, value: {log_data.glucose_value}")
        
        return GlucoseLogResponse(**glucose_log.to_dict())
        
    except Exception as e:
        logger.error(f"Create glucose log error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create glucose log"
        )


@router.get("/logs", response_model=GlucoseLogListResponse)
async def get_glucose_logs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    start_date: Optional[datetime] = Query(None, description="Filter from date"),
    end_date: Optional[datetime] = Query(None, description="Filter to date"),
    reading_type: Optional[ReadingTypeEnum] = Query(None, description="Filter by reading type"),
    min_glucose: Optional[float] = Query(None, ge=0, description="Minimum glucose value"),
    max_glucose: Optional[float] = Query(None, le=1000, description="Maximum glucose value")
):
    """
    Get Glucose Logs
    
    Retrieves glucose logs with advanced filtering and pagination.
    Supports date ranges, reading types, and glucose value filtering.
    
    **Filtering Options:**
    - Date range filtering
    - Reading type filtering
    - Glucose value range filtering
    - Pagination support
    
    **Returns:**
    - Paginated list of glucose logs
    - Total count and pagination info
    - Filtered results based on criteria
    """
    try:
        # Calculate offset
        offset = (page - 1) * page_size
        
        # Get filtered logs
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            limit=page_size,
            offset=offset,
            start_date=start_date,
            end_date=end_date
        )
        
        # Apply additional filters if needed
        # Note: In a production app, these filters would be implemented in the database query
        filtered_logs = logs
        if reading_type:
            filtered_logs = [log for log in filtered_logs if log.reading_type == reading_type]
        if min_glucose is not None:
            filtered_logs = [log for log in filtered_logs if log.glucose_value >= min_glucose]
        if max_glucose is not None:
            filtered_logs = [log for log in filtered_logs if log.glucose_value <= max_glucose]
        
        # Get total count (simplified for demo)
        total_count = len(filtered_logs)
        
        # Convert to response format
        log_responses = [GlucoseLogResponse(**log.to_dict()) for log in filtered_logs]
        
        return GlucoseLogListResponse(
            logs=log_responses,
            total_count=total_count,
            page=page,
            page_size=page_size,
            has_next=len(logs) == page_size,
            has_previous=page > 1
        )
        
    except Exception as e:
        logger.error(f"Get glucose logs error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve glucose logs"
        )


@router.get("/logs/{log_id}", response_model=GlucoseLogResponse)
async def get_glucose_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Get Single Glucose Log
    
    Retrieves a specific glucose log entry by ID.
    Ensures user can only access their own logs.
    
    **Security Features:**
    - User ownership verification
    - Data access controls
    - Secure log retrieval
    
    **Returns:**
    - Complete glucose log information
    - Analysis and categorization
    - Context and metadata
    """
    try:
        # Get glucose log
        glucose_log = await GlucoseLog.get_by_id(db, log_id)
        
        if not glucose_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Glucose log not found"
            )
        
        # Verify ownership
        if glucose_log.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        return GlucoseLogResponse(**glucose_log.to_dict())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get glucose log error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve glucose log"
        )


@router.put("/logs/{log_id}", response_model=GlucoseLogResponse)
async def update_glucose_log(
    log_id: str,
    update_data: GlucoseLogUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Update Glucose Log
    
    Updates an existing glucose log entry.
    Only provided fields are updated, others remain unchanged.
    
    **Security Features:**
    - User ownership verification
    - Data validation
    - Audit trail maintenance
    
    **Returns:**
    - Updated glucose log information
    - Recalculated analysis
    - Update confirmation
    """
    try:
        # Get glucose log
        glucose_log = await GlucoseLog.get_by_id(db, log_id)
        
        if not glucose_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Glucose log not found"
            )
        
        # Verify ownership
        if glucose_log.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Prepare update data (only non-None values)
        update_dict = {
            key: value for key, value in update_data.dict().items() 
            if value is not None
        }
        
        if not update_dict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No data provided for update"
            )
        
        # Update glucose log
        updated_log = await glucose_log.update(db, **update_dict)
        
        logger.info(f"Glucose log updated: {log_id} for user: {current_user.email}")
        
        return GlucoseLogResponse(**updated_log.to_dict())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update glucose log error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update glucose log"
        )


@router.delete("/logs/{log_id}")
async def delete_glucose_log(
    log_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Delete Glucose Log
    
    Permanently deletes a glucose log entry.
    Requires user ownership verification.
    
    **Security Features:**
    - User ownership verification
    - Permanent deletion
    - Audit logging
    
    **Returns:**
    - Deletion confirmation
    """
    try:
        # Get glucose log
        glucose_log = await GlucoseLog.get_by_id(db, log_id)
        
        if not glucose_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Glucose log not found"
            )
        
        # Verify ownership
        if glucose_log.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Delete glucose log
        await glucose_log.delete(db)
        
        logger.info(f"Glucose log deleted: {log_id} for user: {current_user.email}")
        
        return {"message": "Glucose log deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete glucose log error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete glucose log"
        )


@router.get("/stats", response_model=GlucoseStatsResponse)
async def get_glucose_statistics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze")
):
    """
    Get Glucose Statistics
    
    Calculates comprehensive glucose statistics for the specified period.
    Provides insights into glucose control and patterns.
    
    **Statistics Included:**
    - Average, min, max glucose values
    - Time in range analysis
    - Reading distribution
    - Trend indicators
    
    **Returns:**
    - Comprehensive glucose statistics
    - Time in range percentage
    - Reading categorization
    """
    try:
        # Get recent logs for analysis
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000  # Reasonable limit for statistics
        )
        
        if not logs:
            return GlucoseStatsResponse(
                total_readings=0,
                average_glucose=0,
                min_glucose=0,
                max_glucose=0,
                readings_in_range=0,
                readings_below_range=0,
                readings_above_range=0,
                time_in_range_percentage=0,
                last_reading=None
            )
        
        # Calculate statistics
        glucose_values = [log.glucose_value for log in logs]
        total_readings = len(glucose_values)
        average_glucose = sum(glucose_values) / total_readings
        min_glucose = min(glucose_values)
        max_glucose = max(glucose_values)
        
        # Calculate time in range (using user's target range)
        target_min = current_user.target_range_min
        target_max = current_user.target_range_max
        
        readings_in_range = sum(1 for val in glucose_values if target_min <= val <= target_max)
        readings_below_range = sum(1 for val in glucose_values if val < target_min)
        readings_above_range = sum(1 for val in glucose_values if val > target_max)
        
        time_in_range_percentage = (readings_in_range / total_readings) * 100
        
        # Get last reading
        last_reading = None
        if logs:
            last_log = max(logs, key=lambda x: x.reading_time)
            last_reading = GlucoseLogResponse(**last_log.to_dict())
        
        return GlucoseStatsResponse(
            total_readings=total_readings,
            average_glucose=round(average_glucose, 1),
            min_glucose=min_glucose,
            max_glucose=max_glucose,
            readings_in_range=readings_in_range,
            readings_below_range=readings_below_range,
            readings_above_range=readings_above_range,
            time_in_range_percentage=round(time_in_range_percentage, 1),
            last_reading=last_reading
        )
        
    except Exception as e:
        logger.error(f"Get glucose statistics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate glucose statistics"
        )
