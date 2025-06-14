import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { ApiResponse, ApiError } from './types';
import { storageService } from '../storage/storageService';

/**
 * Professional API Client for GlucoVision
 * Handles all HTTP requests with proper error handling, interceptors, and typing
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        // Temporarily disable automatic token refresh to prevent infinite loops
        // TODO: Implement proper token refresh logic later
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await storageService.getSecureItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  private handleApiError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      // FastAPI returns errors in 'detail' field, not 'message'
      const errorMessage = error.response.data?.detail ||
                          error.response.data?.message ||
                          'Server error occurred';

      return {
        message: errorMessage,
        status: error.response.status,
        code: error.response.data?.code || 'SERVER_ERROR',
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // Generic HTTP methods - FastAPI returns data directly
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.delete<T>(url, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return await this.client.patch<T>(url, data, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
