"""
GlucoVision AI Insights Endpoints
=================================

Professional AI-powered insights API endpoints.
Provides intelligent glucose analysis, pattern recognition, and recommendations.

Features:
- Comprehensive glucose pattern analysis
- Personalized recommendations
- Trend analysis and predictions
- Risk assessment
- Medical-grade AI insights
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
from typing import Optional
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


@router.get("/insights")
async def get_ai_insights(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze")
):
    """
    Get AI-Powered Glucose Insights
    
    Provides comprehensive AI analysis of glucose patterns, trends, and recommendations.
    Uses machine learning algorithms to identify patterns and generate personalized insights.
    
    **AI Features:**
    - Pattern recognition and trend analysis
    - Personalized recommendations
    - Risk assessment and alerts
    - Time-based pattern identification
    - Meal and exercise correlation analysis
    
    **Returns:**
    - Comprehensive glucose analysis
    - Personalized recommendations
    - Risk assessments
    - Actionable insights
    """
    try:
        # Get glucose logs for analysis
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000  # Reasonable limit for AI analysis
        )
        
        # Perform AI analysis
        analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        
        # Add metadata
        analysis["metadata"] = {
            "analysis_date": datetime.utcnow().isoformat(),
            "analysis_period_days": days,
            "total_logs_analyzed": len(logs),
            "user_id": current_user.id,
            "ai_version": "1.0.0"
        }
        
        logger.info(f"AI insights generated for user: {current_user.email}, logs: {len(logs)}")
        
        return {
            "success": True,
            "message": "AI insights generated successfully",
            "data": analysis
        }
        
    except Exception as e:
        logger.error(f"AI insights error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate AI insights"
        )


@router.get("/trends")
async def get_glucose_trends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze")
):
    """
    Get Glucose Trends Analysis
    
    Provides detailed trend analysis using machine learning algorithms.
    Identifies short-term and long-term glucose patterns.
    
    **Trend Analysis Features:**
    - Linear regression trend analysis
    - Seasonal pattern detection
    - Variability analysis
    - Prediction modeling
    
    **Returns:**
    - Trend direction and strength
    - Pattern predictions
    - Variability metrics
    - Trend visualizations data
    """
    try:
        # Get glucose logs for trend analysis
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000
        )
        
        if len(logs) < 4:
            return {
                "success": False,
                "message": "Insufficient data for trend analysis",
                "data": {
                    "trend": "insufficient_data",
                    "recommendations": [
                        "Log more glucose readings to enable trend analysis",
                        "Aim for at least 4 readings over the selected period"
                    ]
                }
            }
        
        # Perform trend analysis
        analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        trends_data = analysis.get("trends", {})
        patterns_data = analysis.get("patterns", {})
        
        # Enhanced trend response
        trend_response = {
            "trend_analysis": trends_data,
            "pattern_analysis": patterns_data,
            "time_analysis": analysis.get("time_analysis", {}),
            "recommendations": analysis.get("recommendations", []),
            "metadata": {
                "analysis_period": days,
                "total_readings": len(logs),
                "analysis_date": datetime.utcnow().isoformat()
            }
        }
        
        return {
            "success": True,
            "message": "Trend analysis completed successfully",
            "data": trend_response
        }
        
    except Exception as e:
        logger.error(f"Trend analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze glucose trends"
        )


@router.get("/recommendations")
async def get_personalized_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze")
):
    """
    Get Personalized AI Recommendations
    
    Generates personalized recommendations based on glucose patterns,
    lifestyle factors, and medical history.
    
    **Recommendation Categories:**
    - Glucose control strategies
    - Lifestyle modifications
    - Meal timing and nutrition
    - Exercise recommendations
    - Medical consultation alerts
    
    **Returns:**
    - Prioritized recommendations
    - Actionable insights
    - Risk alerts
    - Lifestyle suggestions
    """
    try:
        # Get glucose logs for recommendation analysis
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000
        )
        
        # Perform AI analysis for recommendations
        analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        recommendations = analysis.get("recommendations", [])
        risk_assessment = analysis.get("risk_assessment", {})
        
        # Add general recommendations based on user profile
        general_recommendations = []
        
        # Diabetes type specific recommendations
        if current_user.diabetes_type:
            if current_user.diabetes_type.value == "type1":
                general_recommendations.append({
                    "type": "diabetes_management",
                    "priority": "medium",
                    "title": "Type 1 Diabetes Management",
                    "message": "Continue regular blood glucose monitoring and insulin management as prescribed by your healthcare provider.",
                    "action": "maintain_routine"
                })
            elif current_user.diabetes_type.value == "type2":
                general_recommendations.append({
                    "type": "diabetes_management",
                    "priority": "medium",
                    "title": "Type 2 Diabetes Management",
                    "message": "Focus on lifestyle modifications including diet and exercise alongside your medication regimen.",
                    "action": "lifestyle_focus"
                })
        
        # Activity level recommendations
        if hasattr(current_user, 'activity_level') and current_user.activity_level == "low":
            general_recommendations.append({
                "type": "exercise",
                "priority": "medium",
                "title": "Increase Physical Activity",
                "message": "Regular physical activity can help improve glucose control. Consider starting with 10-15 minutes of walking daily.",
                "action": "increase_activity"
            })
        
        all_recommendations = recommendations + general_recommendations
        
        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        all_recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "low"), 2))
        
        return {
            "success": True,
            "message": "Personalized recommendations generated successfully",
            "data": {
                "recommendations": all_recommendations,
                "risk_assessment": risk_assessment,
                "total_recommendations": len(all_recommendations),
                "high_priority_count": len([r for r in all_recommendations if r.get("priority") == "high"]),
                "metadata": {
                    "analysis_period": days,
                    "total_readings": len(logs),
                    "user_diabetes_type": current_user.diabetes_type.value if current_user.diabetes_type else None,
                    "analysis_date": datetime.utcnow().isoformat()
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Recommendations error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate personalized recommendations"
        )


@router.get("/risk-assessment")
async def get_risk_assessment(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze")
):
    """
    Get AI Risk Assessment
    
    Provides comprehensive risk assessment based on glucose patterns
    and identifies potential health concerns.
    
    **Risk Categories:**
    - Hypoglycemia risk
    - Hyperglycemia risk
    - Glucose variability risk
    - Long-term complication risk
    
    **Returns:**
    - Risk levels and scores
    - Alert notifications
    - Preventive recommendations
    - Medical consultation alerts
    """
    try:
        # Get glucose logs for risk assessment
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000
        )
        
        if len(logs) < 4:
            return {
                "success": False,
                "message": "Insufficient data for risk assessment",
                "data": {
                    "risk_level": "unknown",
                    "message": "More glucose readings needed for accurate risk assessment"
                }
            }
        
        # Perform AI analysis for risk assessment
        analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        risk_data = analysis.get("risk_assessment", {})
        overview = analysis.get("overview", {})
        
        # Calculate overall risk score
        risk_factors = []
        overall_risk_score = 0
        
        # Variability risk
        if risk_data.get("variability_risk") == "high":
            risk_factors.append("High glucose variability")
            overall_risk_score += 3
        elif risk_data.get("variability_risk") == "moderate":
            overall_risk_score += 1
        
        # Hypoglycemia risk
        if risk_data.get("hypoglycemia_risk") == "high":
            risk_factors.append("Frequent low glucose episodes")
            overall_risk_score += 3
        elif risk_data.get("hypoglycemia_risk") == "moderate":
            overall_risk_score += 1
        
        # Hyperglycemia risk
        if risk_data.get("hyperglycemia_risk") == "high":
            risk_factors.append("Frequent high glucose episodes")
            overall_risk_score += 3
        elif risk_data.get("hyperglycemia_risk") == "moderate":
            overall_risk_score += 1
        
        # Time in range
        time_in_range = overview.get("time_in_range_percent", 100)
        if time_in_range < 50:
            risk_factors.append("Poor glucose control (low time in range)")
            overall_risk_score += 2
        elif time_in_range < 70:
            overall_risk_score += 1
        
        # Determine overall risk level
        if overall_risk_score >= 6:
            overall_risk = "high"
        elif overall_risk_score >= 3:
            overall_risk = "moderate"
        else:
            overall_risk = "low"
        
        return {
            "success": True,
            "message": "Risk assessment completed successfully",
            "data": {
                "overall_risk_level": overall_risk,
                "risk_score": overall_risk_score,
                "risk_factors": risk_factors,
                "detailed_assessment": risk_data,
                "glucose_overview": overview,
                "alerts": [
                    {
                        "type": "medical_consultation",
                        "message": "Consider discussing these patterns with your healthcare provider",
                        "urgent": overall_risk == "high"
                    }
                ] if overall_risk in ["high", "moderate"] else [],
                "metadata": {
                    "analysis_period": days,
                    "total_readings": len(logs),
                    "assessment_date": datetime.utcnow().isoformat()
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Risk assessment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete risk assessment"
        )


@router.get("/patterns")
async def get_glucose_patterns(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session),
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze")
):
    """
    Get Glucose Pattern Analysis
    
    Identifies specific glucose patterns including time-of-day variations,
    meal correlations, and lifestyle factor impacts.
    
    **Pattern Categories:**
    - Time-of-day patterns
    - Day-of-week variations
    - Meal-related patterns
    - Exercise correlations
    - Medication effectiveness
    
    **Returns:**
    - Detailed pattern analysis
    - Correlation insights
    - Behavioral recommendations
    - Optimization suggestions
    """
    try:
        # Get glucose logs for pattern analysis
        start_date = datetime.utcnow() - timedelta(days=days)
        logs = await GlucoseLog.get_user_logs(
            db,
            user_id=current_user.id,
            start_date=start_date,
            limit=1000
        )
        
        if len(logs) < 4:
            return {
                "success": False,
                "message": "Insufficient data for pattern analysis",
                "data": {
                    "patterns": {},
                    "message": "More glucose readings needed for pattern identification"
                }
            }
        
        # Perform AI analysis for patterns
        analysis = await ai_service.analyze_glucose_patterns(current_user, logs)
        
        pattern_response = {
            "time_patterns": analysis.get("patterns", {}),
            "meal_correlation": analysis.get("meal_correlation", {}),
            "exercise_impact": analysis.get("exercise_impact", {}),
            "medication_effectiveness": analysis.get("medication_effectiveness", {}),
            "time_analysis": analysis.get("time_analysis", {}),
            "insights": [
                "Your glucose patterns show unique individual characteristics",
                "Regular monitoring helps identify these patterns",
                "Use these insights to optimize your diabetes management"
            ],
            "metadata": {
                "analysis_period": days,
                "total_readings": len(logs),
                "pattern_analysis_date": datetime.utcnow().isoformat()
            }
        }
        
        return {
            "success": True,
            "message": "Pattern analysis completed successfully",
            "data": pattern_response
        }
        
    except Exception as e:
        logger.error(f"Pattern analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze glucose patterns"
        )
