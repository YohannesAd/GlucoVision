import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/config';
import { AnalyticsInsight } from '../api/types';

/**
 * Analytics Service for GlucoVision
 * Handles AI insights, trends analysis, and health recommendations
 */
class AnalyticsService {
  /**
   * Get AI-powered insights for the user
   */
  async getInsights(params?: {
    period?: 'week' | 'month' | 'quarter';
    types?: string[];
  }): Promise<AnalyticsInsight[]> {
    try {
      const response = await apiClient.get<AnalyticsInsight[]>(
        ENDPOINTS.ANALYTICS.INSIGHTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error('Error fetching insights:', error);
      return [];
    }
  }

  /**
   * Get detailed analytics reports
   */
  async getReports(params: {
    startDate: string;
    endDate: string;
    reportType: 'summary' | 'detailed' | 'trends';
  }): Promise<any> {
    try {
      const response = await apiClient.get(
        ENDPOINTS.ANALYTICS.REPORTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch analytics reports');
    } catch (error) {
      throw this.handleAnalyticsError(error);
    }
  }

  /**
   * Get glucose predictions based on historical data
   */
  async getPredictions(params: {
    horizon: 'hour' | 'day' | 'week';
    includeFactors?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.get(
        ENDPOINTS.ANALYTICS.PREDICTIONS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch predictions');
    } catch (error) {
      throw this.handleAnalyticsError(error);
    }
  }

  /**
   * Track user behavior for analytics (privacy-compliant)
   */
  async trackEvent(event: {
    name: string;
    category: 'navigation' | 'interaction' | 'feature_usage';
    properties?: Record<string, any>;
  }): Promise<void> {
    try {
      // Only track if user has consented to analytics
      const hasConsent = await this.hasAnalyticsConsent();
      if (!hasConsent) return;

      // Track event (implement with your analytics provider)
      console.log('Analytics event:', event);
      
      // TODO: Implement with analytics provider (Firebase, Mixpanel, etc.)
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Check if user has consented to analytics
   */
  private async hasAnalyticsConsent(): Promise<boolean> {
    // TODO: Implement consent checking logic
    return true;
  }

  /**
   * Handle analytics service errors
   */
  private handleAnalyticsError(error: any): Error {
    if (error.code === 'INSUFFICIENT_DATA') {
      return new Error('Not enough data for analysis');
    } else if (error.code === 'ANALYSIS_FAILED') {
      return new Error('Analysis could not be completed');
    }
    
    return new Error(error.message || 'Analytics service error');
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
