import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { authService } from '../auth/authService';

/**
 * API Interceptors for GlucoVision
 * Request and response interceptors for authentication, logging, and error handling
 */

// Request interceptor to add authentication token
export const authRequestInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  try {
    const token = await authService.getAuthToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  } catch (error) {
    console.error('Error in auth request interceptor:', error);
    return config;
  }
};

// Request interceptor for logging (development only)
export const loggingRequestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (__DEV__) {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params,
    });
  }
  
  return config;
};

// Response interceptor for logging (development only)
export const loggingResponseInterceptor = (response: AxiosResponse): AxiosResponse => {
  if (__DEV__) {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
  }
  
  return response;
};

// Response interceptor for handling authentication errors
export const authResponseInterceptor = async (error: any): Promise<any> => {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    try {
      // Try to refresh the token
      const newToken = await authService.refreshToken();
      
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return originalRequest;
      }
    } catch (refreshError) {
      // Refresh failed, redirect to login
      console.error('Token refresh failed:', refreshError);
      await authService.logout();
      // TODO: Navigate to login screen
      // NavigationService.navigate('Login');
    }
  }
  
  return Promise.reject(error);
};

// Response interceptor for handling network errors
export const networkErrorInterceptor = (error: any): Promise<any> => {
  if (!error.response) {
    // Network error
    console.error('Network error:', error.message);
    
    // TODO: Show network error toast/alert
    // ToastService.showError('Network error - please check your connection');
  }
  
  return Promise.reject(error);
};

// Response interceptor for handling server errors
export const serverErrorInterceptor = (error: any): Promise<any> => {
  if (error.response?.status >= 500) {
    console.error('Server error:', error.response.data);
    
    // TODO: Show server error toast/alert
    // ToastService.showError('Server error - please try again later');
  }
  
  return Promise.reject(error);
};

// Request interceptor to add request ID for tracking
export const requestIdInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const requestId = generateRequestId();
  
  if (config.headers) {
    config.headers['X-Request-ID'] = requestId;
  }
  
  return config;
};

// Utility function to generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Request interceptor for adding app version and platform info
export const appInfoInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.headers) {
    config.headers['X-App-Version'] = '1.0.0'; // TODO: Get from app config
    config.headers['X-Platform'] = 'react-native';
    config.headers['X-Device-Type'] = 'mobile';
  }
  
  return config;
};

// Response interceptor for handling rate limiting
export const rateLimitInterceptor = async (error: any): Promise<any> => {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    
    if (retryAfter) {
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
      
      // TODO: Show rate limit message to user
      // ToastService.showWarning(`Too many requests. Please wait ${retryAfter} seconds`);
    }
  }
  
  return Promise.reject(error);
};
