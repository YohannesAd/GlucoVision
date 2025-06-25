"""
GlucoVision AI Service
======================

Professional AI/ML service for glucose pattern analysis and insights.
Provides intelligent recommendations and predictive analytics.

Features:
- Advanced glucose pattern recognition
- Machine learning trend analysis
- Personalized recommendations
- Medical-grade insights
- Time-series analysis
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from datetime import datetime
from typing import List, Dict, Any
import logging
import statistics
import math

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

    def _safe_float(self, value, default=0.0):
        """Convert value to JSON-safe float, handling NaN and Infinity"""
        try:
            if value is None:
                return default

            # Convert to float
            float_val = float(value)

            # Check for NaN or Infinity
            if math.isnan(float_val) or math.isinf(float_val):
                return default

            return float_val
        except (ValueError, TypeError, OverflowError):
            return default

    def _safe_round(self, value, decimals=1, default=0.0):
        """Safely round a value to specified decimals"""
        safe_val = self._safe_float(value, default)
        try:
            return round(safe_val, decimals)
        except (ValueError, TypeError, OverflowError):
            return default
        
    async def analyze_glucose_patterns(self, user: User, logs: List[GlucoseLog]) -> Dict[str, Any]:
        """
        Comprehensive Glucose Pattern Analysis

        Analyzes glucose logs to identify patterns, trends, and insights using ML.

        Args:
            user: User instance
            logs: List of glucose logs

        Returns:
            dict: Analysis results
        """
        try:
            if len(logs) < self.min_logs_for_analysis:
                return self._insufficient_data_response()

            # Convert logs to DataFrame for advanced analysis
            df = self._logs_to_dataframe(logs)

            # Perform comprehensive ML analysis
            overview_stats = self._calculate_overview_stats(df, user)
            trends = self._analyze_trends(df)
            patterns = self._identify_patterns(df)
            recommendations = self._generate_recommendations(df, user)
            risk_assessment = self._assess_risk_factors(df, user)
            time_analysis = self._analyze_time_patterns(df)
            meal_correlation = self._analyze_meal_correlation(df)

            # Add advanced ML features
            anomaly_detection = self._detect_anomalies(df)

            analysis = {
                "overview": overview_stats,
                "trends": trends,
                "patterns": patterns,
                "recommendations": recommendations,
                "risk_assessment": risk_assessment,
                "time_analysis": time_analysis,
                "meal_correlation": meal_correlation,
                "exercise_impact": {"insufficient_data": True, "message": "Exercise tracking not available"},
                "medication_effectiveness": {"insufficient_data": True, "message": "Medication tracking not available"},
                "anomaly_detection": anomaly_detection
            }

            logger.info(f"AI analysis completed for user: {user.email}")
            return analysis

        except Exception as e:
            logger.error(f"AI analysis error: {e}")
            return self._error_response()
    
    def _calculate_simple_stats(self, logs: List[GlucoseLog], user: User) -> Dict[str, Any]:
        """Calculate basic glucose statistics"""
        values = [log.glucose_value for log in logs]
        
        # Basic statistics
        avg_glucose = statistics.mean(values)
        min_glucose = min(values)
        max_glucose = max(values)
        
        # Target range analysis
        target_min = user.target_range_min or 80
        target_max = user.target_range_max or 180
        
        in_range = sum(1 for val in values if target_min <= val <= target_max)
        below_range = sum(1 for val in values if val < target_min)
        above_range = sum(1 for val in values if val > target_max)
        
        time_in_range = (in_range / len(values)) * 100
        
        return {
            "total_readings": len(logs),
            "average_glucose": round(avg_glucose, 1),
            "min_glucose": min_glucose,
            "max_glucose": max_glucose,
            "time_in_range": round(time_in_range, 1),
            "readings_in_range": in_range,
            "readings_below_range": below_range,
            "readings_above_range": above_range
        }
    
    def _analyze_simple_trends(self, logs: List[GlucoseLog]) -> Dict[str, Any]:
        """Analyze basic glucose trends"""
        if len(logs) < 3:
            return {"trend": "insufficient_data", "direction": "unknown"}
        
        # Sort logs by time
        sorted_logs = sorted(logs, key=lambda x: x.reading_time)
        values = [log.glucose_value for log in sorted_logs]
        
        # Simple trend calculation
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        first_avg = statistics.mean(first_half)
        second_avg = statistics.mean(second_half)
        
        change = second_avg - first_avg
        
        if abs(change) < 5:
            trend = "stable"
            direction = "stable"
        elif change > 0:
            trend = "increasing"
            direction = "upward"
        else:
            trend = "decreasing"
            direction = "downward"
        
        return {
            "trend": trend,
            "direction": direction,
            "change": round(change, 1),
            "trend_strength": "moderate"
        }
    
    def _identify_simple_patterns(self, logs: List[GlucoseLog]) -> Dict[str, Any]:
        """Identify basic glucose patterns"""
        # Group by hour of day
        hourly_readings = {}
        for log in logs:
            hour = log.reading_time.hour
            if hour not in hourly_readings:
                hourly_readings[hour] = []
            hourly_readings[hour].append(log.glucose_value)
        
        # Calculate hourly averages
        hourly_averages = {}
        for hour, readings in hourly_readings.items():
            hourly_averages[hour] = round(statistics.mean(readings), 1)
        
        # Find peak and lowest hours
        if hourly_averages:
            peak_hour = max(hourly_averages, key=hourly_averages.get)
            lowest_hour = min(hourly_averages, key=hourly_averages.get)
        else:
            peak_hour = 12
            lowest_hour = 6
        
        return {
            "hourly_averages": hourly_averages,
            "peak_hour": peak_hour,
            "lowest_hour": lowest_hour,
            "pattern_strength": "moderate"
        }
    
    def _generate_simple_recommendations(self, logs: List[GlucoseLog], user: User) -> List[Dict[str, Any]]:
        """Generate basic recommendations"""
        recommendations = []
        values = [log.glucose_value for log in logs]
        avg_glucose = statistics.mean(values)
        
        # Basic recommendations based on average glucose
        if avg_glucose > 180:
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "High Average Glucose",
                "message": "Your average glucose is elevated. Consider consulting your healthcare provider.",
                "action": "consult_doctor"
            })
        elif avg_glucose < 70:
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "Low Average Glucose",
                "message": "Your average glucose is low. Monitor for hypoglycemia symptoms.",
                "action": "monitor_closely"
            })
        else:
            recommendations.append({
                "type": "glucose_control",
                "priority": "normal",
                "title": "Good Glucose Control",
                "message": "Your glucose levels are within a reasonable range. Keep up the good work!",
                "action": "continue_monitoring"
            })
        
        # General recommendations
        recommendations.append({
            "type": "lifestyle",
            "priority": "medium",
            "title": "Regular Monitoring",
            "message": "Continue logging your glucose readings regularly for better insights.",
            "action": "log_regularly"
        })
        
        return recommendations

    def _logs_to_dataframe(self, logs: List[GlucoseLog]) -> pd.DataFrame:
        """Convert glucose logs to pandas DataFrame for analysis using available data only"""
        data = []
        for log in logs:
            data.append({
                'glucose_value': log.glucose_value,
                'reading_time': log.reading_time,
                'reading_type': log.reading_type.value if log.reading_type else 'unknown',
                'meal_type': log.meal_type.value if log.meal_type else None,
                'hour': log.reading_time.hour,
                'day_of_week': log.reading_time.weekday(),
                'is_weekend': log.reading_time.weekday() >= 5,
                'notes': log.notes or '',
                'has_notes': bool(log.notes and log.notes.strip())
            })

        df = pd.DataFrame(data)
        df['reading_time'] = pd.to_datetime(df['reading_time'])
        df = df.sort_values('reading_time')
        return df

    def _calculate_overview_stats(self, df: pd.DataFrame, user: User) -> Dict[str, Any]:
        """Calculate comprehensive overview statistics using pandas"""
        glucose_values = df['glucose_value']

        # Basic statistics
        avg_glucose = glucose_values.mean()
        min_glucose = glucose_values.min()
        max_glucose = glucose_values.max()
        std_glucose = glucose_values.std()

        # Target range analysis
        target_min = user.target_range_min or 80
        target_max = user.target_range_max or 180

        in_range = ((glucose_values >= target_min) & (glucose_values <= target_max)).sum()
        below_range = (glucose_values < target_min).sum()
        above_range = (glucose_values > target_max).sum()

        time_in_range = (in_range / len(glucose_values)) * 100

        # Variability metrics with NaN/Infinity protection
        cv = 0
        if avg_glucose > 0 and not np.isnan(std_glucose) and not np.isnan(avg_glucose):
            cv = (std_glucose / avg_glucose) * 100
            if np.isnan(cv) or np.isinf(cv):
                cv = 0

        return {
            "total_readings": len(df),
            "average_glucose": self._safe_round(avg_glucose, 1),
            "min_glucose": self._safe_float(min_glucose),
            "max_glucose": self._safe_float(max_glucose),
            "glucose_variability": self._safe_round(std_glucose, 1),
            "coefficient_variation": self._safe_round(cv, 1),
            "time_in_range": self._safe_round(time_in_range, 1),
            "readings_in_range": int(in_range),
            "readings_below_range": int(below_range),
            "readings_above_range": int(above_range)
        }

    def _analyze_trends(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze glucose trends using linear regression"""
        if len(df) < 3:
            return {"trend": "insufficient_data", "direction": "unknown", "slope": 0}

        # Prepare data for regression
        df_sorted = df.sort_values('reading_time')
        X = np.arange(len(df_sorted)).reshape(-1, 1)
        y = df_sorted['glucose_value'].values

        # Fit linear regression
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
            recent_avg = df_sorted.tail(recent_days)['glucose_value'].mean()
            older_avg = df_sorted.head(len(df) - recent_days)['glucose_value'].mean()
            recent_change = recent_avg - older_avg
        else:
            recent_change = 0

        # Advanced ML Predictions
        predictions = self._generate_glucose_predictions(df_sorted, model)

        return {
            "trend": trend,
            "direction": direction,
            "slope": self._safe_round(slope, 3),
            "r_squared": self._safe_round(r_squared, 3),
            "recent_change": self._safe_round(recent_change, 1),
            "trend_strength": "strong" if self._safe_float(r_squared) > 0.7 else "moderate" if self._safe_float(r_squared) > 0.4 else "weak",
            "predictions": predictions
        }

    def _identify_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Identify glucose patterns using advanced ML clustering"""
        patterns = {}

        # Time-of-day patterns
        hourly_avg = df.groupby('hour')['glucose_value'].mean()
        patterns['hourly_averages'] = {int(k): self._safe_float(v) for k, v in hourly_avg.to_dict().items()}
        patterns['peak_hour'] = int(hourly_avg.idxmax())
        patterns['lowest_hour'] = int(hourly_avg.idxmin())

        # Day-of-week patterns
        daily_avg = df.groupby('day_of_week')['glucose_value'].mean()
        patterns['daily_averages'] = {int(k): self._safe_float(v) for k, v in daily_avg.to_dict().items()}
        patterns['weekend_vs_weekday'] = {
            'weekend_avg': self._safe_round(df[df['is_weekend']]['glucose_value'].mean(), 1),
            'weekday_avg': self._safe_round(df[~df['is_weekend']]['glucose_value'].mean(), 1)
        }

        # Advanced Pattern Recognition with K-Means Clustering (using available data only)
        if len(df) >= 10:  # Need enough data for clustering
            try:
                # Create feature matrix for clustering using only available data
                features = df[['glucose_value', 'hour', 'day_of_week']].copy()

                # Add reading type as numeric feature
                reading_type_map = {'fasting': 1, 'before_meal': 2, 'after_meal': 3, 'bedtime': 4, 'random': 5}
                features['reading_type_numeric'] = df['reading_type'].map(reading_type_map).fillna(5)

                # Add weekend indicator
                features['is_weekend_numeric'] = df['is_weekend'].astype(int)

                # Scale features for better clustering
                features_scaled = self.scaler.fit_transform(features)

                # Perform K-means clustering to find glucose behavior patterns
                n_clusters = min(3, len(df) // 4)  # Adaptive cluster count
                kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
                clusters = kmeans.fit_predict(features_scaled)

                # Analyze clusters
                df_clustered = df.copy()
                df_clustered['cluster'] = clusters

                cluster_analysis = {}
                for cluster_id in range(n_clusters):
                    cluster_data = df_clustered[df_clustered['cluster'] == cluster_id]
                    cluster_analysis[f'pattern_{cluster_id}'] = {
                        'avg_glucose': self._safe_round(cluster_data['glucose_value'].mean(), 1),
                        'common_time': int(cluster_data['hour'].mode().iloc[0]) if len(cluster_data) > 0 else 12,
                        'common_reading_type': cluster_data['reading_type'].mode().iloc[0] if len(cluster_data) > 0 else 'random',
                        'weekend_frequency': self._safe_round(cluster_data['is_weekend'].mean() * 100, 1),
                        'pattern_frequency': len(cluster_data),
                        'description': self._describe_cluster_pattern_simple(cluster_data)
                    }

                patterns['ml_clusters'] = cluster_analysis
                patterns['dominant_pattern'] = max(cluster_analysis.keys(),
                                                 key=lambda x: cluster_analysis[x]['pattern_frequency'])

            except Exception as e:
                logger.warning(f"ML clustering failed: {e}")
                patterns['ml_clusters'] = {"error": "Insufficient data for advanced pattern recognition"}

        return patterns

    def _describe_cluster_pattern(self, cluster_data: pd.DataFrame) -> str:
        """Generate human-readable description of glucose pattern cluster"""
        avg_glucose = cluster_data['glucose_value'].mean()
        common_hour = cluster_data['hour'].mode().iloc[0] if len(cluster_data) > 0 else 12
        avg_carbs = cluster_data['carbs_consumed'].mean()

        time_desc = "morning" if common_hour < 12 else "afternoon" if common_hour < 18 else "evening"
        glucose_desc = "elevated" if avg_glucose > 150 else "optimal" if avg_glucose > 80 else "low"
        carb_desc = "higher carbohydrate" if avg_carbs > 50 else "moderate carbohydrate" if avg_carbs > 20 else "lower carbohydrate"

        return f"{glucose_desc} glucose levels during {time_desc} with {carb_desc} intake"

    def _describe_cluster_pattern_simple(self, cluster_data: pd.DataFrame) -> str:
        """Generate human-readable description using only available data"""
        avg_glucose = cluster_data['glucose_value'].mean()
        common_hour = cluster_data['hour'].mode().iloc[0] if len(cluster_data) > 0 else 12
        common_reading_type = cluster_data['reading_type'].mode().iloc[0] if len(cluster_data) > 0 else 'random'
        weekend_freq = cluster_data['is_weekend'].mean()

        # Time description
        if common_hour < 6:
            time_desc = "early morning"
        elif common_hour < 12:
            time_desc = "morning"
        elif common_hour < 17:
            time_desc = "afternoon"
        elif common_hour < 21:
            time_desc = "evening"
        else:
            time_desc = "night"

        # Glucose description
        if avg_glucose > 180:
            glucose_desc = "elevated"
        elif avg_glucose > 120:
            glucose_desc = "moderate"
        elif avg_glucose > 80:
            glucose_desc = "optimal"
        else:
            glucose_desc = "low"

        # Reading type description
        reading_desc = common_reading_type.replace('_', ' ')

        # Weekend pattern
        day_pattern = "weekend" if weekend_freq > 0.6 else "weekday" if weekend_freq < 0.4 else "mixed day"

        return f"{glucose_desc} glucose during {time_desc} {reading_desc} readings, mostly on {day_pattern}s"

    def _generate_glucose_predictions(self, df: pd.DataFrame, model: LinearRegression) -> Dict[str, Any]:
        """Generate glucose predictions using trained ML model"""
        try:
            # Predict next 3 readings based on trend
            last_index = len(df) - 1
            future_indices = np.array([[last_index + 1], [last_index + 2], [last_index + 3]])
            predictions = model.predict(future_indices)

            # Calculate prediction confidence based on model performance
            confidence = model.score(np.arange(len(df)).reshape(-1, 1), df['glucose_value'].values)

            return {
                "next_reading_prediction": self._safe_round(predictions[0], 1),
                "short_term_predictions": [self._safe_round(p, 1) for p in predictions],
                "confidence_score": self._safe_round(confidence, 3),
                "prediction_reliability": "high" if self._safe_float(confidence) > 0.7 else "moderate" if self._safe_float(confidence) > 0.4 else "low"
            }
        except Exception as e:
            logger.warning(f"Prediction generation failed: {e}")
            return {"error": "Unable to generate predictions"}

    def _detect_anomalies(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect glucose anomalies using statistical methods"""
        glucose_values = df['glucose_value']

        # Calculate statistical thresholds
        mean_glucose = glucose_values.mean()
        std_glucose = glucose_values.std()

        # Define anomaly thresholds (2 standard deviations)
        upper_threshold = mean_glucose + (2 * std_glucose)
        lower_threshold = mean_glucose - (2 * std_glucose)

        # Find anomalies
        anomalies = df[
            (df['glucose_value'] > upper_threshold) |
            (df['glucose_value'] < lower_threshold)
        ]

        # Advanced ML-based anomaly detection
        ml_anomalies = self._ml_anomaly_detection(df)

        return {
            "anomaly_count": len(anomalies),
            "anomaly_percentage": self._safe_round((len(anomalies) / len(df)) * 100, 1) if len(df) > 0 else 0.0,
            "severe_highs": len(df[df['glucose_value'] > 300]),
            "severe_lows": len(df[df['glucose_value'] < 50]),
            "anomaly_threshold_high": self._safe_round(upper_threshold, 1),
            "anomaly_threshold_low": self._safe_round(lower_threshold, 1),
            "ml_anomaly_detection": ml_anomalies
        }

    def _ml_anomaly_detection(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Advanced ML-based anomaly detection using available data only"""
        try:
            if len(df) < 10:
                return {"insufficient_data": True}

            # Prepare features for anomaly detection using only available data
            features = df[['glucose_value', 'hour', 'day_of_week']].copy()

            # Add reading type as numeric feature
            reading_type_map = {'fasting': 1, 'before_meal': 2, 'after_meal': 3, 'bedtime': 4, 'random': 5}
            features['reading_type_numeric'] = df['reading_type'].map(reading_type_map).fillna(5)

            # Scale features
            features_scaled = self.scaler.fit_transform(features)

            # Apply Isolation Forest for anomaly detection
            isolation_forest = IsolationForest(contamination=0.1, random_state=42)
            anomaly_labels = isolation_forest.fit_predict(features_scaled)

            # Identify anomalous readings
            anomaly_indices = np.where(anomaly_labels == -1)[0]
            anomalous_readings = df.iloc[anomaly_indices]

            return {
                "ml_anomaly_count": len(anomaly_indices),
                "ml_anomaly_percentage": round((len(anomaly_indices) / len(df)) * 100, 1),
                "anomalous_glucose_values": [self._safe_round(val, 1) for val in anomalous_readings['glucose_value'].tolist()],
                "anomaly_detection_method": "Advanced Pattern Detection"
            }

        except Exception as e:
            logger.warning(f"ML anomaly detection failed: {e}")
            return {"error": "ML anomaly detection unavailable"}

    def _generate_recommendations(self, df: pd.DataFrame, user: User) -> List[Dict[str, Any]]:
        """Generate ML-based personalized recommendations"""
        recommendations = []
        avg_glucose = df['glucose_value'].mean()
        glucose_std = df['glucose_value'].std()

        # High variability recommendation with NaN protection
        cv = 0
        if avg_glucose > 0 and not np.isnan(glucose_std) and not np.isnan(avg_glucose):
            cv = (glucose_std / avg_glucose) * 100
            if np.isnan(cv) or np.isinf(cv):
                cv = 0

        if cv > 30:
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "High Glucose Variability",
                "message": f"Your glucose variability is {cv:.1f}%. Consider more consistent meal timing and medication schedules.",
                "action": "improve_consistency"
            })

        # Average glucose recommendations
        if avg_glucose > 180:
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "Elevated Average Glucose",
                "message": f"Your average glucose is {avg_glucose:.1f} mg/dL. Consult your healthcare provider about adjusting your treatment plan.",
                "action": "consult_doctor"
            })
        elif avg_glucose < 70:
            recommendations.append({
                "type": "glucose_control",
                "priority": "high",
                "title": "Low Average Glucose",
                "message": f"Your average glucose is {avg_glucose:.1f} mg/dL. Monitor for hypoglycemia symptoms and discuss with your healthcare provider.",
                "action": "monitor_closely"
            })
        else:
            recommendations.append({
                "type": "glucose_control",
                "priority": "normal",
                "title": "Good Glucose Control",
                "message": f"Your average glucose is {avg_glucose:.1f} mg/dL, which is within a good range. Keep up the excellent work!",
                "action": "continue_monitoring"
            })

        return recommendations

    def _assess_risk_factors(self, df: pd.DataFrame, user: User) -> Dict[str, Any]:
        """Assess diabetes-related risk factors"""
        avg_glucose = df['glucose_value'].mean()
        high_readings = (df['glucose_value'] > 250).sum()
        low_readings = (df['glucose_value'] < 70).sum()

        risk_level = "low"
        risk_factors = []

        if avg_glucose > 200:
            risk_level = "high"
            risk_factors.append("Consistently elevated glucose levels")
        elif avg_glucose > 150:
            risk_level = "moderate"
            risk_factors.append("Moderately elevated glucose levels")

        if high_readings > 0:
            risk_factors.append(f"{high_readings} severe hyperglycemic episodes")

        if low_readings > 0:
            risk_factors.append(f"{low_readings} hypoglycemic episodes")

        return {
            "level": risk_level,
            "factors": risk_factors,
            "message": f"Risk assessment based on {len(df)} readings"
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
            "dawn_phenomenon_detected": bool(dawn_phenomenon),
            "morning_average": self._safe_round(morning_readings.mean(), 1) if len(morning_readings) > 0 else None,
            "evening_average": self._safe_round(night_readings.mean(), 1) if len(night_readings) > 0 else None
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

        if len(exercise_data) < 3:
            return {"insufficient_data": True}

        exercise_avg = exercise_data['glucose_value'].mean()
        no_exercise_avg = df[df['exercise_duration'] == 0]['glucose_value'].mean()

        return {
            "exercise_average": self._safe_round(exercise_avg, 1),
            "no_exercise_average": self._safe_round(no_exercise_avg, 1),
            "exercise_benefit": self._safe_round(no_exercise_avg - exercise_avg, 1)
        }

    def _analyze_medication_impact(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze medication effectiveness"""
        med_data = df[df['medication_taken'] == True]

        if len(med_data) < 3:
            return {"insufficient_data": True}

        med_avg = med_data['glucose_value'].mean()
        no_med_avg = df[df['medication_taken'] == False]['glucose_value'].mean()

        return {
            "with_medication_average": self._safe_round(med_avg, 1),
            "without_medication_average": self._safe_round(no_med_avg, 1),
            "medication_effectiveness": self._safe_round(no_med_avg - med_avg, 1)
        }

    def _insufficient_data_response(self) -> Dict[str, Any]:
        """Response for insufficient data"""
        return {
            "status": "insufficient_data",
            "message": "Not enough glucose readings for comprehensive analysis. Please log at least 4 readings.",
            "overview": {
                "total_readings": 0,
                "average_glucose": 0,
                "time_in_range": 0
            },
            "trends": {"trend": "insufficient_data"},
            "patterns": {},
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
            "overview": {
                "total_readings": 0,
                "average_glucose": 0,
                "time_in_range": 0
            },
            "trends": {"trend": "error"},
            "patterns": {},
            "recommendations": []
        }


# Create global AI service instance
ai_service = GlucoseAIService()
