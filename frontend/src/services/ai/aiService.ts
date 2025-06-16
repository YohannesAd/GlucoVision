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
      glucose_variability: string;
      control_status: string;
    };
    trends: {
      direction: 'improving' | 'stable' | 'declining';
      percentage_change: number;
      weekly_average: number;
      trend_confidence: number;
    };
    recommendations: Array<{
      type: string;
      priority: 'high' | 'medium' | 'low';
      title: string;
      message: string;
      action?: string;
    }>;
    risk_assessment: {
      overall_risk: 'low' | 'moderate' | 'high';
      hypoglycemia_risk: string;
      hyperglycemia_risk: string;
      variability_risk: string;
    };
    patterns: {
      time_patterns: Record<string, any>;
      meal_correlation: Record<string, any>;
      best_control_times: string[];
    };
    metadata: {
      analysis_date: string;
      analysis_period_days: number;
      total_logs_analyzed: number;
      ai_version: string;
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
