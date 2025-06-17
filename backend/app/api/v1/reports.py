"""
GlucoVision Reports Endpoints
=============================

Professional medical report generation API endpoints.
Provides PDF report generation for healthcare providers and personal use.

Features:
- Comprehensive glucose reports
- Medical-grade documentation
- PDF export capabilities
- Customizable report periods
- Healthcare provider formatting
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional
import io
import logging

from app.core.database import get_async_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.glucose_log import GlucoseLog
from app.services.ai_service import ai_service

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


@router.get("/glucose-summary")
async def generate_glucose_summary_report(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=1, le=365, description="Number of days to include"),
    format: str = Query("json", regex="^(json|pdf)$", description="Report format")
):
    """
    Generate Glucose Summary Report
    
    Creates a comprehensive glucose summary report for the specified period.
    Includes statistics, trends, and AI insights.
    
    **Report Contents:**
    - Glucose statistics and trends
    - Time in range analysis
    - AI-powered insights
    - Risk assessment
    - Recommendations
    
    **Formats:**
    - JSON: Structured data for applications
    - PDF: Professional medical report
    
    **Returns:**
    - Comprehensive glucose summary
    - Medical-grade documentation
    - Actionable insights
    """
    try:
        # Get glucose logs for the report period
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000
        )
        
        # Generate AI analysis
        ai_analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        
        # Compile report data
        report_data = {
            "report_info": {
                "title": "Glucose Management Summary Report",
                "patient_name": current_user.full_name,
                "patient_email": current_user.email,
                "report_period": f"{days} days",
                "start_date": start_date.isoformat(),
                "end_date": datetime.utcnow().isoformat(),
                "generated_date": datetime.utcnow().isoformat(),
                "total_readings": len(logs)
            },
            "patient_profile": {
                "diabetes_type": current_user.diabetes_type.value if current_user.diabetes_type else "Not specified",
                "diagnosis_date": current_user.diagnosis_date.isoformat() if current_user.diagnosis_date else None,
                "preferred_unit": current_user.preferred_unit,
                "target_range": f"{current_user.target_range_min}-{current_user.target_range_max} {current_user.preferred_unit}",
                "current_medications": current_user.current_medications or [],
                "uses_insulin": current_user.uses_insulin
            },
            "glucose_statistics": ai_analysis.get("overview", {}),
            "trend_analysis": ai_analysis.get("trends", {}),
            "pattern_analysis": ai_analysis.get("patterns", {}),
            "risk_assessment": ai_analysis.get("risk_assessment", {}),
            "recommendations": ai_analysis.get("recommendations", []),
            "recent_readings": [
                {
                    "date": log.reading_time.isoformat(),
                    "value": log.glucose_value,
                    "unit": log.unit,
                    "type": log.reading_type.value if log.reading_type else "unknown",
                    "notes": log.notes
                }
                for log in logs[-10:]  # Last 10 readings
            ]
        }
        
        if format == "json":
            return {
                "success": True,
                "message": "Glucose summary report generated successfully",
                "data": report_data
            }
        
        elif format == "pdf":
            # Generate PDF report
            pdf_content = await _generate_pdf_report(report_data)
            
            # Return PDF as streaming response
            return StreamingResponse(
                io.BytesIO(pdf_content),
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename=glucose_report_{current_user.id}_{datetime.utcnow().strftime('%Y%m%d')}.pdf"
                }
            )
        
    except Exception as e:
        logger.error(f"Report generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate glucose summary report"
        )


@router.get("/medical-report")
async def generate_medical_report(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(90, ge=7, le=365, description="Number of days to include"),
    include_raw_data: bool = Query(False, description="Include raw glucose readings")
):
    """
    Generate Medical Report for Healthcare Providers
    
    Creates a professional medical report formatted for healthcare providers.
    Includes comprehensive analysis and clinical recommendations.
    
    **Medical Report Features:**
    - Clinical summary and assessment
    - Glucose control metrics
    - Risk stratification
    - Treatment recommendations
    - Professional formatting
    
    **Returns:**
    - Medical-grade report
    - Clinical insights
    - Professional recommendations
    """
    try:
        # Get glucose logs for medical report
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=2000  # More data for medical report
        )
        
        # Generate comprehensive AI analysis
        ai_analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        
        # Medical report structure
        medical_report = {
            "clinical_summary": {
                "patient_information": {
                    "name": current_user.full_name,
                    "diabetes_type": current_user.diabetes_type.value if current_user.diabetes_type else "Not specified",
                    "diagnosis_date": current_user.diagnosis_date.isoformat() if current_user.diagnosis_date else None,
                    "age": _calculate_age(current_user.date_of_birth) if current_user.date_of_birth else None,
                    "gender": current_user.gender.value if current_user.gender else None
                },
                "monitoring_period": {
                    "start_date": start_date.isoformat(),
                    "end_date": datetime.utcnow().isoformat(),
                    "duration_days": days,
                    "total_readings": len(logs),
                    "average_readings_per_day": round(len(logs) / days, 1)
                },
                "current_treatment": {
                    "medications": current_user.current_medications or [],
                    "insulin_therapy": current_user.uses_insulin,
                    "target_glucose_range": f"{current_user.target_range_min}-{current_user.target_range_max} {current_user.preferred_unit}"
                }
            },
            "glucose_control_assessment": {
                "overall_control": ai_analysis.get("overview", {}),
                "time_in_range_analysis": {
                    "target_achievement": ai_analysis.get("overview", {}).get("time_in_range_percent", 0),
                    "clinical_significance": _interpret_time_in_range(ai_analysis.get("overview", {}).get("time_in_range_percent", 0))
                },
                "glycemic_variability": {
                    "coefficient_of_variation": ai_analysis.get("risk_assessment", {}).get("coefficient_of_variation", 0),
                    "variability_assessment": ai_analysis.get("risk_assessment", {}).get("variability_risk", "unknown")
                }
            },
            "clinical_insights": {
                "trend_analysis": ai_analysis.get("trends", {}),
                "pattern_identification": ai_analysis.get("patterns", {}),
                "risk_stratification": ai_analysis.get("risk_assessment", {}),
                "behavioral_correlations": {
                    "meal_patterns": ai_analysis.get("meal_correlation", {}),
                    "exercise_impact": ai_analysis.get("exercise_impact", {}),
                    "medication_effectiveness": ai_analysis.get("medication_effectiveness", {})
                }
            },
            "clinical_recommendations": {
                "immediate_actions": [
                    rec for rec in ai_analysis.get("recommendations", [])
                    if rec.get("priority") == "high"
                ],
                "lifestyle_modifications": [
                    rec for rec in ai_analysis.get("recommendations", [])
                    if rec.get("type") in ["exercise", "nutrition", "lifestyle"]
                ],
                "monitoring_adjustments": [
                    "Continue regular glucose monitoring",
                    "Consider continuous glucose monitoring if not already using",
                    "Review medication timing and dosing with healthcare provider"
                ]
            }
        }
        
        # Add raw data if requested
        if include_raw_data:
            medical_report["raw_glucose_data"] = [
                {
                    "timestamp": log.reading_time.isoformat(),
                    "glucose_value": log.glucose_value,
                    "unit": log.unit,
                    "reading_type": log.reading_type.value if log.reading_type else "unknown",
                    "meal_type": log.meal_type.value if log.meal_type else None,
                    "notes": log.notes,
                    "context": {
                        "carbs_consumed": log.carbs_consumed,
                        "exercise_duration": log.exercise_duration,
                        "insulin_taken": log.insulin_taken,
                        "insulin_units": log.insulin_units,
                        "medication_taken": log.medication_taken,
                        "stress_level": log.stress_level,
                        "illness": log.illness
                    }
                }
                for log in logs
            ]
        
        return {
            "success": True,
            "message": "Medical report generated successfully",
            "report_type": "medical_professional",
            "data": medical_report
        }
        
    except Exception as e:
        logger.error(f"Medical report generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate medical report"
        )


@router.get("/export-data")
async def export_glucose_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    start_date: Optional[datetime] = Query(None, description="Start date for export"),
    end_date: Optional[datetime] = Query(None, description="End date for export"),
    format: str = Query("json", regex="^(json|csv)$", description="Export format")
):
    """
    Export Glucose Data
    
    Exports glucose data in various formats for external use.
    Supports date range filtering and multiple export formats.
    
    **Export Features:**
    - Date range filtering
    - Multiple format support
    - Complete data export
    - Privacy-compliant export
    
    **Formats:**
    - JSON: Structured data format
    - CSV: Spreadsheet-compatible format
    
    **Returns:**
    - Complete glucose dataset
    - Formatted for external use
    - Privacy-compliant export
    """
    try:
        # Set default date range if not provided
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=90)  # Default 90 days
        
        # Get glucose logs for export
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            limit=5000  # Large limit for export
        )
        
        # Prepare export data
        export_data = []
        for log in logs:
            export_data.append({
                "date": log.reading_time.isoformat(),
                "glucose_value": log.glucose_value,
                "unit": log.unit,
                "reading_type": log.reading_type.value if log.reading_type else "",
                "meal_type": log.meal_type.value if log.meal_type else "",
                "notes": log.notes or "",
                "carbs_consumed": log.carbs_consumed or 0,
                "exercise_duration": log.exercise_duration or 0,
                "exercise_type": log.exercise_type or "",
                "insulin_taken": log.insulin_taken,
                "insulin_units": log.insulin_units or 0,
                "medication_taken": log.medication_taken,
                "stress_level": log.stress_level or 0,
                "sleep_hours": log.sleep_hours or 0,
                "illness": log.illness
            })
        
        if format == "json":
            return {
                "success": True,
                "message": "Glucose data exported successfully",
                "export_info": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "total_records": len(export_data),
                    "format": "json"
                },
                "data": export_data
            }
        
        elif format == "csv":
            # Generate CSV content
            csv_content = await _generate_csv_export(export_data)
            
            return StreamingResponse(
                io.StringIO(csv_content),
                media_type="text/csv",
                headers={
                    "Content-Disposition": f"attachment; filename=glucose_data_{current_user.id}_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}.csv"
                }
            )
        
    except Exception as e:
        logger.error(f"Data export error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export glucose data"
        )


# Helper functions
def _calculate_age(birth_date: datetime) -> int:
    """Calculate age from birth date"""
    today = datetime.utcnow().date()
    birth = birth_date.date()
    return today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))


def _interpret_time_in_range(tir_percent: float) -> str:
    """Interpret time in range percentage clinically"""
    if tir_percent >= 70:
        return "Excellent glucose control"
    elif tir_percent >= 50:
        return "Good glucose control with room for improvement"
    elif tir_percent >= 30:
        return "Suboptimal glucose control - intervention recommended"
    else:
        return "Poor glucose control - immediate medical attention recommended"


async def _generate_pdf_report(report_data: dict) -> bytes:
    """Generate PDF report (placeholder implementation)"""
    # This would use ReportLab to generate actual PDF
    # For now, return a placeholder
    return b"PDF report content would be generated here using ReportLab"


async def _generate_csv_export(data: list) -> str:
    """Generate CSV export content"""
    if not data:
        return "No data to export"
    
    # CSV headers
    headers = list(data[0].keys())
    csv_lines = [",".join(headers)]
    
    # CSV data rows
    for row in data:
        csv_row = []
        for header in headers:
            value = str(row.get(header, ""))
            # Escape commas and quotes
            if "," in value or '"' in value:
                value = '"' + value.replace('"', '""') + '"'
            csv_row.append(value)
        csv_lines.append(",".join(csv_row))
    
    return "\n".join(csv_lines)
