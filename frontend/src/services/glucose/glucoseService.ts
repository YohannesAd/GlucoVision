import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/config';
import { 
  GlucoseReading, 
  CreateGlucoseReadingRequest, 
  GlucoseStatistics,
  PaginatedResponse,
  PaginationParams 
} from '../api/types';

/**
 * Glucose Service for GlucoVision
 * Handles all glucose reading and analytics operations
 */
class GlucoseService {
  /**
   * Create a new glucose reading
   */
  async createReading(reading: CreateGlucoseReadingRequest): Promise<GlucoseReading> {
    try {
      const response = await apiClient.post<GlucoseReading>(
        ENDPOINTS.GLUCOSE.READINGS,
        reading
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to create glucose reading');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get glucose readings with pagination
   */
  async getReadings(params?: PaginationParams & {
    startDate?: string;
    endDate?: string;
    mealContext?: string;
  }): Promise<PaginatedResponse<GlucoseReading>> {
    try {
      const response = await apiClient.get<PaginatedResponse<GlucoseReading>>(
        ENDPOINTS.GLUCOSE.READINGS,
        { params }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch glucose readings');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get a specific glucose reading by ID
   */
  async getReading(id: string): Promise<GlucoseReading> {
    try {
      const response = await apiClient.get<GlucoseReading>(
        ENDPOINTS.GLUCOSE.READING(id)
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch glucose reading');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Update a glucose reading
   */
  async updateReading(id: string, updates: Partial<CreateGlucoseReadingRequest>): Promise<GlucoseReading> {
    try {
      const response = await apiClient.put<GlucoseReading>(
        ENDPOINTS.GLUCOSE.READING(id),
        updates
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to update glucose reading');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Delete a glucose reading
   */
  async deleteReading(id: string): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.GLUCOSE.READING(id));
      // FastAPI returns 204 No Content for successful deletes
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get glucose statistics for a time period
   */
  async getStatistics(params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<GlucoseStatistics> {
    try {
      const response = await apiClient.get<GlucoseStatistics>(
        ENDPOINTS.GLUCOSE.STATISTICS,
        { params }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch glucose statistics');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get glucose trends and patterns
   */
  async getTrends(params: {
    period: 'week' | 'month' | 'quarter' | 'year';
    includePatterns?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.get(
        ENDPOINTS.GLUCOSE.TRENDS,
        { params }
      );

      if (response.data) {
        return response.data;
      }

      throw new Error('Failed to fetch glucose trends');
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Export glucose data
   */
  async exportData(params: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'pdf' | 'json';
  }): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(
        ENDPOINTS.GLUCOSE.EXPORT,
        {
          params,
          responseType: 'blob'
        }
      );

      return response.data;
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get recent readings for dashboard
   */
  async getRecentReadings(limit: number = 10): Promise<GlucoseReading[]> {
    try {
      const response = await this.getReadings({
        page: 1,
        limit,
        sortBy: 'timestamp',
        sortOrder: 'desc'
      });

      return response.data;
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Get readings for today
   */
  async getTodayReadings(): Promise<GlucoseReading[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    try {
      const response = await this.getReadings({
        startDate: startOfDay,
        endDate: endOfDay,
        page: 1,
        limit: 100
      });

      return response.data;
    } catch (error) {
      throw this.handleGlucoseError(error);
    }
  }

  /**
   * Handle glucose service errors
   */
  private handleGlucoseError(error: any): Error {
    if (error.code === 'INVALID_GLUCOSE_VALUE') {
      return new Error('Invalid glucose value provided');
    } else if (error.code === 'READING_NOT_FOUND') {
      return new Error('Glucose reading not found');
    } else if (error.code === 'DUPLICATE_READING') {
      return new Error('A reading for this time already exists');
    } else if (error.code === 'NETWORK_ERROR') {
      return new Error('Network error - please check your connection');
    }
    
    return new Error(error.message || 'Glucose service error');
  }
}

// Export singleton instance
export const glucoseService = new GlucoseService();
export default glucoseService;
