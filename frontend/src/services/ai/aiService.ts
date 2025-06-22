/**
 * GlucoVision AI Service
 * ======================
 * 
 *AI service for real-time glucose insights and recommendations.
 * Integrates with backend AI endpoints to provide personalized diabetes management.

 */

import { API_BASE_URL } from '../api/config';
import { AIInsight, TrendData, PredictionData } from '../../types';

export interface AIInsightsResponse {
  success: boolean;
  message: string;
  data: {
    overview: {
      average_glucose: number;
      time_in_range: number;
      total_readings: number;
      glucose_variability: number;
      coefficient_variation: number;
      min_glucose: number;
      max_glucose: number;
      readings_in_range: number;
      readings_below_range: number;
      readings_above_range: number;
    };
    trends: {
      trend: string;
      direction: string;
      slope: number;
      r_squared: number;
      recent_change: number;
      trend_strength: string;
      predictions?: {
        next_reading_prediction: number;
        short_term_predictions: number[];
        confidence_score: number;
        prediction_reliability: string;
      };
    };
    patterns: {
      hourly_averages: Record<number, number>;
      peak_hour: number;
      lowest_hour: number;
      daily_averages: Record<number, number>;
      weekend_vs_weekday: {
        weekend_avg: number;
        weekday_avg: number;
      };
      ml_clusters?: {
        [key: string]: {
          avg_glucose: number;
          common_time: number;
          avg_carbs: number;
          avg_exercise: number;
          pattern_frequency: number;
          description: string;
        };
      };
      dominant_pattern?: string;
    };
    recommendations: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      title: string;
      message: string;
      action?: string;
    }>;
    risk_assessment: {
      level: string;
      factors: string[];
      message: string;
    };
    time_analysis: {
      dawn_phenomenon_detected: boolean;
      morning_average?: number;
      evening_average?: number;
    };
    meal_correlation: {
      insufficient_meal_data?: boolean;
      meal_averages?: Record<string, number>;
      highest_meal_impact?: string;
    };
    exercise_impact: {
      insufficient_data?: boolean;
      exercise_average?: number;
      no_exercise_average?: number;
      exercise_benefit?: number;
    };
    medication_effectiveness: {
      insufficient_data?: boolean;
      with_medication_average?: number;
      without_medication_average?: number;
      medication_effectiveness?: number;
    };
    anomaly_detection: {
      anomaly_count: number;
      anomaly_percentage: number;
      severe_highs: number;
      severe_lows: number;
      anomaly_threshold_high: number;
      anomaly_threshold_low: number;
      ml_anomaly_detection?: {
        ml_anomaly_count: number;
        ml_anomaly_percentage: number;
        anomalous_glucose_values: number[];
        anomaly_detection_method: string;
      };
    };
    metadata: {
      analysis_date: string;
      analysis_period_days?: number;
      total_logs_analyzed?: number;
      ai_version?: string;
    };
  };
}

export interface AIRecommendationsResponse {
  success: boolean;
  message: string;
  data: {
    recommendations: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      title: string;
      message: string;
      action?: string;
      confidence?: number;
    }>;
    risk_assessment: Record<string, any>;
    total_recommendations: number;
    high_priority_count: number;
    metadata: {
      analysis_period: number;
      total_readings: number;
      user_diabetes_type: string;
      analysis_date: string;
    };
  };
}

class AIService {
  /**
   * Get comprehensive AI insights for dashboard
   */
  async getAIInsights(token: string, days: number = 30): Promise<AIInsightsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/insights?days=${days}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI insights error:', response.status, errorText);
        throw new Error(`Failed to fetch AI insights: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI insights service error:', error);
      throw error;
    }
  }

  /**
   * Get personalized AI recommendations
   */
  async getRecommendations(token: string, days: number = 30): Promise<AIRecommendationsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/ai/recommendations?days=${days}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI recommendations error:', response.status, errorText);
        throw new Error(`Failed to fetch AI recommendations: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI recommendations service error:', error);
      throw error;
    }
  }

  /**
   * Convert backend AI data to frontend AIInsight format
   */
  convertToAIInsight(backendData: AIInsightsResponse): AIInsight {
    const { data } = backendData;
    const primaryRecommendation = data.recommendations?.[0];

    // Determine severity based on risk assessment and trends
    let severity: 'positive' | 'warning' | 'critical' | 'info' = 'info';

    // Calculate overall risk from individual risk factors
    const riskAssessment = data.risk_assessment || {};
    const highRisks = Object.values(riskAssessment).filter(risk => risk === 'high').length;
    const moderateRisks = Object.values(riskAssessment).filter(risk => risk === 'moderate').length;

    if (highRisks >= 2) {
      severity = 'critical';
    } else if (highRisks >= 1 || moderateRisks >= 2) {
      severity = 'warning';
    } else if (data.trends?.direction === 'improving') {
      severity = 'positive';
    }

    // Create main insight message
    const trendDirection = data.trends?.direction || 'stable';
    const trendText = trendDirection === 'improving' ? 'improving' :
                     trendDirection === 'declining' ? 'needs attention' : 'stable';

    const timeInRange = (data.overview as any)?.time_in_range_percent || data.overview?.time_in_range || 0;
    const avgGlucose = data.overview?.average_glucose || 0;
    const totalLogs = data.metadata?.total_logs_analyzed || 0;

    const message = `Your glucose control is ${trendText} with ${Math.round(timeInRange)}% time in range. ` +
                   `Average glucose: ${Math.round(avgGlucose)} mg/dL over ${totalLogs} readings.`;

    return {
      id: `ai-insight-${Date.now()}`,
      type: primaryRecommendation ? 'recommendation' : 'trend',
      title: primaryRecommendation?.title || `Glucose Control: ${trendText.charAt(0).toUpperCase() + trendText.slice(1)}`,
      message,
      confidence: (data.trends as any)?.trend_confidence || 85,
      actionable: !!primaryRecommendation,
      recommendation: primaryRecommendation?.message,
      severity,
      createdAt: data.metadata?.analysis_date || new Date().toISOString(),
      factors: (data.patterns as any)?.best_control_times || []
    };
  }

  /**
   * Convert backend trends to frontend TrendData format
   */
  convertToTrendData(backendData: AIInsightsResponse): TrendData {
    const { data } = backendData;

    return {
      period: 'week',
      direction: (data.trends as any)?.direction || 'stable',
      percentage: Math.abs((data.trends as any)?.percentage_change || 0),
      timeInRange: (data.overview as any)?.time_in_range_percent || data.overview?.time_in_range || 0,
      averageGlucose: data.overview?.average_glucose || 0,
      readingsCount: data.overview?.total_readings || 0,
      patterns: (data.patterns as any)?.best_control_times || []
    };
  }

  /**
   * Get AI trend analysis for dashboard stats
   */
  async getTrendAnalysis(token: string, days: number = 7): Promise<{
    trend: string;
    patternScore: number;
    nextCheckTime: string;
  }> {
    try {
      const insights = await this.getAIInsights(token, days);

      // Check if we have valid insights data
      if (!insights.success || !insights.data) {
        throw new Error('Invalid insights data');
      }

      const { data } = insights;

      // Calculate pattern score based on time in range and variability
      const timeInRange = (data.overview as any)?.time_in_range_percent || data.overview?.time_in_range || 70;
      const trendConfidence = (data.trends as any)?.trend_confidence || 80;

      const patternScore = Math.round(
        (timeInRange * 0.7) +
        (trendConfidence * 0.3)
      ) / 10;

      // Determine next check time based on recent patterns
      const nextCheckTime = this.calculateNextCheckTime(data);

      const trendDirection = (data.trends as any)?.direction || 'stable';
      const trendIcon = trendDirection === 'improving' ? '↗' : trendDirection === 'declining' ? '↘' : '→';
      const trendText = trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1);

      return {
        trend: `${trendIcon} ${trendText}`,
        patternScore: Math.min(patternScore, 10),
        nextCheckTime
      };
    } catch (error) {
      console.error('Trend analysis error:', error);
      // Return fallback data
      return {
        trend: '→ Stable',
        patternScore: 7.5,
        nextCheckTime: '2h 30m'
      };
    }
  }

  /**
   * Get ML Pattern Analysis for display
   */
  async getMLPatterns(token: string, days: number = 30): Promise<{
    clusters: any[];
    dominantPattern: string;
    predictions: any;
    anomalies: any;
  }> {
    try {
      const insights = await this.getAIInsights(token, days);
      const { data } = insights;

      // Extract ML clustering patterns
      const clusters = data.patterns.ml_clusters ?
        Object.entries(data.patterns.ml_clusters).map(([key, value]: [string, any]) => ({
          id: key,
          name: value.description,
          avgGlucose: value.avg_glucose,
          frequency: value.pattern_frequency,
          commonTime: value.common_time,
          avgCarbs: value.avg_carbs,
          avgExercise: value.avg_exercise
        })) : [];

      // Extract predictions
      const predictions = data.trends.predictions ? {
        nextReading: data.trends.predictions.next_reading_prediction,
        shortTerm: data.trends.predictions.short_term_predictions,
        confidence: data.trends.predictions.confidence_score,
        reliability: data.trends.predictions.prediction_reliability
      } : null;

      // Extract anomaly detection
      const anomalies = {
        statistical: {
          count: data.anomaly_detection.anomaly_count,
          percentage: data.anomaly_detection.anomaly_percentage,
          severeHighs: data.anomaly_detection.severe_highs,
          severeLows: data.anomaly_detection.severe_lows
        },
        ml: data.anomaly_detection.ml_anomaly_detection ? {
          count: data.anomaly_detection.ml_anomaly_detection.ml_anomaly_count,
          percentage: data.anomaly_detection.ml_anomaly_detection.ml_anomaly_percentage,
          values: data.anomaly_detection.ml_anomaly_detection.anomalous_glucose_values,
          method: data.anomaly_detection.ml_anomaly_detection.anomaly_detection_method
        } : null
      };

      return {
        clusters,
        dominantPattern: data.patterns.dominant_pattern || 'No dominant pattern identified',
        predictions,
        anomalies
      };
    } catch (error) {
      console.error('ML patterns error:', error);
      return {
        clusters: [],
        dominantPattern: 'Analysis unavailable',
        predictions: null,
        anomalies: { statistical: { count: 0, percentage: 0, severeHighs: 0, severeLows: 0 }, ml: null }
      };
    }
  }

  /**
   * Get Advanced Analytics Summary
   */
  async getAdvancedAnalytics(token: string, days: number = 30): Promise<{
    variabilityScore: number;
    riskLevel: string;
    exerciseImpact: string;
    medicationEffectiveness: string;
    timePatterns: any;
  }> {
    try {
      const insights = await this.getAIInsights(token, days);
      const { data } = insights;

      // Calculate variability score
      const variabilityScore = Math.round(100 - (data.overview.coefficient_variation || 25));

      // Exercise impact analysis
      let exerciseImpact = 'Insufficient data';
      if (data.exercise_impact && !data.exercise_impact.insufficient_data) {
        const benefit = data.exercise_impact.exercise_benefit || 0;
        exerciseImpact = benefit > 10 ? 'Highly beneficial' :
                        benefit > 5 ? 'Moderately beneficial' :
                        benefit > 0 ? 'Slightly beneficial' : 'No clear benefit';
      }

      // Medication effectiveness
      let medicationEffectiveness = 'Insufficient data';
      if (data.medication_effectiveness && !data.medication_effectiveness.insufficient_data) {
        const effectiveness = data.medication_effectiveness.medication_effectiveness || 0;
        medicationEffectiveness = effectiveness > 20 ? 'Highly effective' :
                                 effectiveness > 10 ? 'Moderately effective' :
                                 effectiveness > 0 ? 'Slightly effective' : 'Limited effectiveness';
      }

      // Time patterns
      const timePatterns = {
        peakHour: data.patterns.peak_hour,
        lowestHour: data.patterns.lowest_hour,
        dawnPhenomenon: data.time_analysis.dawn_phenomenon_detected,
        weekendVsWeekday: data.patterns.weekend_vs_weekday
      };

      return {
        variabilityScore,
        riskLevel: data.risk_assessment.level,
        exerciseImpact,
        medicationEffectiveness,
        timePatterns
      };
    } catch (error) {
      console.error('Advanced analytics error:', error);
      return {
        variabilityScore: 75,
        riskLevel: 'unknown',
        exerciseImpact: 'Analysis unavailable',
        medicationEffectiveness: 'Analysis unavailable',
        timePatterns: {}
      };
    }
  }

  /**
   * Calculate optimal next check time based on patterns
   */
  private calculateNextCheckTime(data: any): string {
    // Simple algorithm - in real app this would be more sophisticated
    const avgTimeBetweenReadings = 4; // hours

    // glucose_variability is a number (coefficient of variation %)
    // High variability (>36%) means more frequent checking needed
    const glucoseVariability = data.overview?.glucose_variability || 25;
    const variabilityFactor = glucoseVariability > 36 ? 0.5 : glucoseVariability > 24 ? 0.75 : 1;
    const nextCheck = Math.round(avgTimeBetweenReadings * variabilityFactor);

    const hours = Math.floor(nextCheck);
    const minutes = Math.round((nextCheck - hours) * 60);

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }
}

export const aiService = new AIService();
