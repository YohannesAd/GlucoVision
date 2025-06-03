/**
 * API Configuration for GlucoVision
 * Centralized configuration for all API-related settings
 */

// Environment-based configuration
const getApiBaseUrl = (): string => {
  // TODO: Replace with your actual backend URL
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    return 'http://localhost:3000/api/v1'; // Local development
  }
  
  return 'https://api.glucovision.com/v1'; // Production
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete',
  },
  
  // Glucose Data
  GLUCOSE: {
    READINGS: '/glucose/readings',
    READING: (id: string) => `/glucose/readings/${id}`,
    STATISTICS: '/glucose/statistics',
    TRENDS: '/glucose/trends',
    EXPORT: '/glucose/export',
  },
  
  // Health Data
  HEALTH: {
    METRICS: '/health/metrics',
    GOALS: '/health/goals',
    REMINDERS: '/health/reminders',
  },
  
  // Analytics
  ANALYTICS: {
    INSIGHTS: '/analytics/insights',
    REPORTS: '/analytics/reports',
    PREDICTIONS: '/analytics/predictions',
  },
} as const;
