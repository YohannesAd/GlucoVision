"""
GlucoVision AI Service
======================

Professional AI/ML service for glucose pattern analysis and insights.
Provides intelligent recommendations and predictive analytics.

Features:
- Glucose pattern recognition
- Trend analysis and predictions
- Personalized recommendations
- Medical-grade insights
- Time-series analysis
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
import logging

from app.models.glucose_log import GlucoseLog
from app.models.user import User

# Configure logging
logger = logging.getLogger(__name__)


class GlucoseAIService:
    """
    Professional AI Service for Glucose Analysis
    
    Provides comprehensive AI-powered insights for glucose management
    including pattern recognition, trend analysis, and personalized recommendations.
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.min_logs_for_analysis = 4
        
    async def analyze_glucose_patterns(self, user: User, logs: List[GlucoseLog]) -> Dict[str, Any]:
        """
        Comprehensive Glucose Pattern Analysis
        
        Analyzes glucose logs to identify patterns, trends, and insights.
        
        Args:
            user: User instance
            logs: List of glucose logs
            
        Returns:
            dict: Comprehensive analysis results
        """
        try:
            if len(logs) < self.min_logs_for_analysis:
                return self._insufficient_data_response()
            
            # Convert logs to DataFrame for analysis
            df = self._logs_to_dataframe(logs)
            
            # Perform various analyses
            analysis = {
                "overview": self._calculate_overview_stats(df, user),
                "trends": self._analyze_trends(df),
                "patterns": self._identify_patterns(df),
                "recommendations": self._generate_recommendations(df, user),
                "risk_assessment": self._assess_risks(df, user),
                "time_analysis": self._analyze_time_patterns(df),
                "meal_correlation": self._analyze_meal_correlation(df),
                "exercise_impact": self._analyze_exercise_impact(df),
                "medication_effectiveness": self._analyze_medication_impact(df)
            }
            
            logger.info(f"AI analysis completed for user: {user.email}")
            return analysis
            
        except Exception as e:
            logger.error(f"AI analysis error: {e}")
            return self._error_response()
    
    def _logs_to_dataframe(self, logs: List[GlucoseLog]) -> pd.DataFrame:
        """Convert glucose logs to pandas DataFrame"""
        data = []
        for log in logs:
            data.append({
                'glucose_value': log.glucose_value,
                'reading_time': log.reading_time,
                'reading_type': log.reading_type.value if log.reading_type else 'unknown',
                'meal_type': log.meal_type.value if log.meal_type else None,
                'carbs_consumed': log.carbs_consumed or 0,
                'exercise_duration': log.exercise_duration or 0,
                'insulin_taken': log.insulin_taken,
                'insulin_units': log.insulin_units or 0,
                'medication_taken': log.medication_taken,
                'stress_level': log.stress_level or 5,
                'sleep_hours': log.sleep_hours or 8,
                'illness': log.illness,
                'hour': log.reading_time.hour,
                'day_of_week': log.reading_time.weekday(),
                'is_weekend': log.reading_time.weekday() >= 5
            })
        
        df = pd.DataFrame(data)
        df['reading_time'] = pd.to_datetime(df['reading_time'])
        df = df.sort_values('reading_time')
        return df
    
    def _calculate_overview_stats(self, df: pd.DataFrame, user: User) -> Dict[str, Any]:
        """Calculate overview statistics"""
        glucose_values = df['glucose_value']
        
        # Basic statistics
        stats = {
            'total_readings': len(df),
            'average_glucose': round(glucose_values.mean(), 1),
            'median_glucose': round(glucose_values.median(), 1),
            'std_glucose': round(glucose_values.std(), 1),
            'min_glucose': glucose_values.min(),
            'max_glucose': glucose_values.max(),
            'glucose_variability': round((glucose_values.std() / glucose_values.mean()) * 100, 1)
        }
        
        # Time in range analysis
        target_min = user.target_range_min
        target_max = user.target_range_max
        
        in_range = ((glucose_values >= target_min) & (glucose_values <= target_max)).sum()
        below_range = (glucose_values < target_min).sum()
        above_range = (glucose_values > target_max).sum()
        
        stats.update({
            'time_in_range_percent': round((in_range / len(df)) * 100, 1),
            'time_below_range_percent': round((below_range / len(df)) * 100, 1),
            'time_above_range_percent': round((above_range / len(df)) * 100, 1),
            'readings_in_range': int(in_range),
            'readings_below_range': int(below_range),
            'readings_above_range': int(above_range)
        })
        
        return stats
    
    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze glucose trends over time"""
        if len(df) < 3:
            return {"trend": "insufficient_data", "direction": "unknown", "slope": 0}
        
        # Prepare data for trend analysis
        df_sorted = df.sort_values('reading_time')
        days_since_start = (df_sorted['reading_time'] - df_sorted['reading_time'].iloc[0]).dt.days
        glucose_values = df_sorted['glucose_value'].values
        
        # Linear regression for trend
        X = days_since_start.values.reshape(-1, 1)
        y = glucose_values
        
        model = LinearRegression()
        model.fit(X, y)
        
        slope = model.coef_[0]
        r_squared = model.score(X, y)
        
        # Determine trend direction
        if abs(slope) < 0.5:
            trend = "stable"
            direction = "stable"
        elif slope > 0:
            trend = "increasing"
            direction = "upward"
        else:
            trend = "decreasing"
            direction = "downward"
        
        # Recent vs older comparison
        recent_days = 7
        if len(df) > recent_days:
            recent_avg = df.tail(recent_days)['glucose_value'].mean()
            older_avg = df.head(len(df) - recent_days)['glucose_value'].mean()
            recent_change = recent_avg - older_avg
        else:
            recent_change = 0
        
        return {
            "trend": trend,
            "direction": direction,
            "slope": round(slope, 3),
            "r_squared": round(r_squared, 3),
            "recent_change": round(recent_change, 1),
            "trend_strength": "strong" if r_squared > 0.7 else "moderate" if r_squared > 0.4 else "weak"
        }
    
    def _identify_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Identify glucose patterns"""
        patterns = {}
        
        # Time-of-day patterns
        hourly_avg = df.groupby('hour')['glucose_value'].mean()
        patterns['hourly_averages'] = hourly_avg.to_dict()
        patterns['peak_hour'] = int(hourly_avg.idxmax())
        patterns['lowest_hour'] = int(hourly_avg.idxmin())
        
        # Day-of-week patterns
        daily_avg = df.groupby('day_of_week')['glucose_value'].mean()
        patterns['daily_averages'] = daily_avg.to_dict()
        patterns['weekend_vs_weekday'] = {
            'weekend_avg': round(df[df['is_weekend']]['glucose_value'].mean(), 1),
            'weekday_avg': round(df[~df['is_weekend']]['glucose_value'].mean(), 1)
        }
        
        # Reading type patterns
        type_avg = df.groupby('reading_type')['glucose_value'].mean()
        patterns['reading_type_averages'] = type_avg.to_dict()
        
        return patterns
    
    def _generate_recommendations(self, df: pd.DataFrame, user: User) -> List[Dict[str, Any]]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # High glucose frequency
        high_readings = (df['glucose_value'] > user.target_range_max).sum()
        if high_readings > len(df) * 0.3:  # More than 30% high
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "Frequent High Glucose Levels",
                "message": f"You have {high_readings} high glucose readings. Consider reviewing your meal portions and medication timing with your healthcare provider.",
                "action": "consult_doctor"
            })
        
        # Low glucose frequency
        low_readings = (df['glucose_value'] < user.target_range_min).sum()
        if low_readings > len(df) * 0.1:  # More than 10% low
            recommendations.append({
                "type": "hypoglycemia",
                "priority": "high",
                "title": "Frequent Low Glucose Episodes",
                "message": f"You have {low_readings} low glucose readings. This may indicate a need to adjust your medication or eating schedule.",
                "action": "consult_doctor"
            })
        
        # Exercise correlation
        if 'exercise_duration' in df.columns and df['exercise_duration'].sum() > 0:
            exercise_effect = self._analyze_exercise_correlation(df)
            if exercise_effect['correlation'] < -0.3:
                recommendations.append({
                    "type": "exercise",
                    "priority": "medium",
                    "title": "Exercise Benefits",
                    "message": "Your glucose levels tend to be lower after exercise. Consider maintaining regular physical activity.",
                    "action": "continue_exercise"
                })
        
        # Meal timing patterns
        meal_patterns = self._analyze_meal_timing(df)
        if meal_patterns['post_meal_spikes'] > 0.4:
            recommendations.append({
                "type": "nutrition",
                "priority": "medium",
                "title": "Post-Meal Glucose Spikes",
                "message": "Your glucose levels often spike after meals. Consider smaller portions or discussing meal timing with a nutritionist.",
                "action": "nutrition_consultation"
            })
        
        return recommendations
    
    def _assess_risks(self, df: pd.DataFrame, user: User) -> Dict[str, Any]:
        """Assess glucose-related risks"""
        glucose_values = df['glucose_value']
        
        # Variability risk
        cv = (glucose_values.std() / glucose_values.mean()) * 100
        variability_risk = "high" if cv > 36 else "moderate" if cv > 24 else "low"
        
        # Hypoglycemia risk
        low_count = (glucose_values < 70).sum()
        hypo_risk = "high" if low_count > 2 else "moderate" if low_count > 0 else "low"
        
        # Hyperglycemia risk
        high_count = (glucose_values > 250).sum()
        hyper_risk = "high" if high_count > 2 else "moderate" if high_count > 0 else "low"
        
        return {
            "variability_risk": variability_risk,
            "hypoglycemia_risk": hypo_risk,
            "hyperglycemia_risk": hyper_risk,
            "coefficient_of_variation": round(cv, 1),
            "severe_low_episodes": int(low_count),
            "severe_high_episodes": int(high_count)
        }
    
    def _analyze_time_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze time-based patterns"""
        # Dawn phenomenon (early morning rise)
        morning_readings = df[df['hour'].between(6, 9)]['glucose_value']
        night_readings = df[df['hour'].between(22, 24)]['glucose_value']
        
        dawn_phenomenon = False
        if len(morning_readings) > 0 and len(night_readings) > 0:
            dawn_phenomenon = morning_readings.mean() > night_readings.mean() + 20
        
        return {
            "dawn_phenomenon_detected": dawn_phenomenon,
            "morning_average": round(morning_readings.mean(), 1) if len(morning_readings) > 0 else None,
            "evening_average": round(night_readings.mean(), 1) if len(night_readings) > 0 else None
        }
    
    def _analyze_meal_correlation(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze meal-related patterns"""
        meal_data = df[df['meal_type'].notna()]
        
        if len(meal_data) == 0:
            return {"insufficient_meal_data": True}
        
        meal_averages = meal_data.groupby('meal_type')['glucose_value'].mean().to_dict()
        
        return {
            "meal_averages": meal_averages,
            "highest_meal_impact": max(meal_averages, key=meal_averages.get) if meal_averages else None
        }
    
    def _analyze_exercise_impact(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze exercise impact on glucose"""
        exercise_data = df[df['exercise_duration'] > 0]
        no_exercise_data = df[df['exercise_duration'] == 0]
        
        if len(exercise_data) == 0:
            return {"no_exercise_data": True}
        
        exercise_avg = exercise_data['glucose_value'].mean()
        no_exercise_avg = no_exercise_data['glucose_value'].mean()
        
        return {
            "exercise_average": round(exercise_avg, 1),
            "no_exercise_average": round(no_exercise_avg, 1),
            "exercise_benefit": round(no_exercise_avg - exercise_avg, 1)
        }
    
    def _analyze_medication_impact(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze medication impact"""
        med_data = df[df['medication_taken'] == True]
        no_med_data = df[df['medication_taken'] == False]
        
        if len(med_data) == 0 or len(no_med_data) == 0:
            return {"insufficient_medication_data": True}
        
        med_avg = med_data['glucose_value'].mean()
        no_med_avg = no_med_data['glucose_value'].mean()
        
        return {
            "with_medication_average": round(med_avg, 1),
            "without_medication_average": round(no_med_avg, 1),
            "medication_effect": round(no_med_avg - med_avg, 1)
        }
    
    def _analyze_exercise_correlation(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze correlation between exercise and glucose"""
        if df['exercise_duration'].sum() == 0:
            return {"correlation": 0, "significance": "none"}
        
        correlation = df['exercise_duration'].corr(df['glucose_value'])
        return {
            "correlation": round(correlation, 3),
            "significance": "strong" if abs(correlation) > 0.7 else "moderate" if abs(correlation) > 0.3 else "weak"
        }
    
    def _analyze_meal_timing(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze meal timing patterns"""
        after_meal_readings = df[df['reading_type'] == 'after_meal']
        
        if len(after_meal_readings) == 0:
            return {"post_meal_spikes": 0}
        
        # Calculate percentage of post-meal readings that are high
        high_post_meal = (after_meal_readings['glucose_value'] > 180).sum()
        spike_percentage = high_post_meal / len(after_meal_readings)
        
        return {"post_meal_spikes": round(spike_percentage, 2)}
    
    def _insufficient_data_response(self) -> Dict[str, Any]:
        """Response for insufficient data"""
        return {
            "status": "insufficient_data",
            "message": "Not enough glucose readings for comprehensive analysis. Please log at least 4 readings.",
            "recommendations": [
                {
                    "type": "data_collection",
                    "priority": "high",
                    "title": "More Data Needed",
                    "message": "Log more glucose readings to get personalized insights and recommendations.",
                    "action": "log_more_readings"
                }
            ]
        }
    
    def _error_response(self) -> Dict[str, Any]:
        """Response for analysis errors"""
        return {
            "status": "error",
            "message": "Unable to complete analysis at this time. Please try again later.",
            "recommendations": []
        }


# Create global AI service instance
ai_service = GlucoseAIService()
