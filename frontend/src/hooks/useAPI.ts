import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * useAPI Hook - Universal API handler
 * Handles auth, glucose, dashboard, user, onboarding, notifications
 */

interface APIConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface APIRequest {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  token?: string;
  showSuccessAlert?: boolean;
  successMessage?: string;
  showErrorAlert?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UseAPIReturn {
  isLoading: boolean;
  error: string | null;
  request: <T = any>(config: APIRequest) => Promise<APIResponse<T>>;
  clearError: () => void;
}

// Get the correct API URL for React Native
const getAPIBaseURL = () => {
  // If environment variable is set, use it
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Check if in development mode
  const isDevelopment = __DEV__;

  if (isDevelopment) {
    // Use your computer's actual IP address for development
    return 'http://10.0.0.226:8000';
  }

  // Use production Railway URL
  return 'https://glucovision-production.up.railway.app';
};

const DEFAULT_CONFIG: APIConfig = {
  baseURL: getAPIBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export function useAPI(config: APIConfig = {}): UseAPIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiConfig = { ...DEFAULT_CONFIG, ...config };

  const request = useCallback(async <T = any>(requestConfig: APIRequest): Promise<APIResponse<T>> => {
    const {
      endpoint,
      method = 'GET',
      data,
      params,
      token,
      showSuccessAlert = false,
      successMessage = 'Operation completed successfully',
      showErrorAlert = true,
      onSuccess,
      onError
    } = requestConfig;

    try {
      setIsLoading(true);
      setError(null);

      // Build URL with params
      const url = new URL(endpoint, apiConfig.baseURL);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Build headers
      const headers = { ...apiConfig.headers };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Build request options
      const requestOptions: RequestInit = {
        method,
        headers,
      };

      if (data && method !== 'GET') {
        requestOptions.body = JSON.stringify(data);
      }

      // Make request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

      const response = await fetch(url.toString(), {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new Error(responseData?.message || responseData || `HTTP ${response.status}`);
      }

      // Handle success
      const result: APIResponse<T> = {
        success: true,
        data: responseData,
        message: responseData?.message
      };

      if (showSuccessAlert) {
        Alert.alert('Success', successMessage);
      }

      if (onSuccess) {
        onSuccess(responseData);
      }

      return result;

    } catch (err: any) {
      const errorMessage = err.name === 'AbortError' 
        ? 'Request timeout' 
        : err.message || 'Network error occurred';

      setError(errorMessage);

      const result: APIResponse<T> = {
        success: false,
        error: errorMessage
      };

      if (showErrorAlert) {
        Alert.alert('Error', errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }

      return result;

    } finally {
      setIsLoading(false);
    }
  }, [apiConfig]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    request,
    clearError
  };
}

// Pre-configured API hooks for common operations
export function useAuthAPI() {
  return useAPI();
}

export function useGlucoseAPI() {
  return useAPI();
}

export function useDashboardAPI() {
  return useAPI();
}

export function useUserAPI() {
  return useAPI();
}

// Common API endpoints - Match backend FastAPI routes exactly
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    SIGNUP: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    VERIFY_RESET_CODE: '/api/v1/auth/verify-reset-code',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD: '/api/v1/auth/change-password'
  },

  // Glucose endpoints
  GLUCOSE: {
    LOGS: '/api/v1/glucose/logs',
    ADD_LOG: '/api/v1/glucose/logs',
    UPDATE_LOG: (id: string) => `/api/v1/glucose/logs/${id}`,
    DELETE_LOG: (id: string) => `/api/v1/glucose/logs/${id}`,
    STATISTICS: '/api/v1/glucose/stats',
    EXPORT: '/api/v1/glucose/export'
  },

  // User endpoints
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile',
    ONBOARDING_STATUS: '/api/v1/users/onboarding/status',
    ONBOARDING_STEP1: '/api/v1/users/onboarding/step1',
    ONBOARDING_STEP2: '/api/v1/users/onboarding/step2',
    ONBOARDING_STEP3: '/api/v1/users/onboarding/step3',
    DELETE_ACCOUNT: '/api/v1/users/account'
  },

  // AI endpoints
  AI: {
    INSIGHTS: '/api/v1/ai/insights',
    TRENDS: '/api/v1/ai/trends',
    RECOMMENDATIONS: '/api/v1/ai/recommendations'
  },

  // Reports endpoints
  REPORTS: {
    GLUCOSE_SUMMARY: '/api/v1/reports/glucose-summary',
    MEDICAL_REPORT: '/api/v1/reports/medical-report',
    EXPORT_DATA: '/api/v1/reports/export-data'
  }
};
