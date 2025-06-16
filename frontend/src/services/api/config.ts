/**
 * API Configuration for GlucoVision
 * Centralized configuration for all API-related settings
 */

// Environment-based configuration
const getApiBaseUrl = (): string => {
  // FastAPI backend URL
  const isDevelopment = __DEV__;

  if (isDevelopment) {
    // For mobile devices and emulators, use your computer's IP address
    // Make sure backend is running with --host 0.0.0.0 --port 8000
    // Replace with your computer's actual IP address
    return 'http://10.0.0.226:8000'; // FastAPI development server
  }

  return 'https://your-glucovision-api.railway.app'; // Production (Railway)
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Export API_BASE_URL for backward compatibility with existing services
export const API_BASE_URL = API_CONFIG.BASE_URL;

// API Endpoints (FastAPI Backend)
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    VERIFY_RESET_CODE: '/api/v1/auth/verify-reset-code',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    ME: '/api/v1/auth/me',
    VERIFY_TOKEN: '/api/v1/auth/verify-token',
  },

  // User Management
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile',
    ONBOARDING_STATUS: '/api/v1/users/onboarding/status',
    ONBOARDING_STEP1: '/api/v1/users/onboarding/step1',
    ONBOARDING_STEP2: '/api/v1/users/onboarding/step2',
    ONBOARDING_STEP3: '/api/v1/users/onboarding/step3',
    DELETE_ACCOUNT: '/api/v1/users/account',
  },

  // Glucose Data
  GLUCOSE: {
    READINGS: '/api/v1/glucose/logs', // Alias for consistency
    LOGS: '/api/v1/glucose/logs',
    READING: (id: string) => `/api/v1/glucose/logs/${id}`,
    LOG: (id: string) => `/api/v1/glucose/logs/${id}`,
    STATS: '/api/v1/glucose/stats',
    STATISTICS: '/api/v1/glucose/stats', // Alias for consistency
    TRENDS: '/api/v1/glucose/trends',
    EXPORT: '/api/v1/glucose/export',
  },

  // AI Insights
  AI: {
    INSIGHTS: '/api/v1/ai/insights',
    TRENDS: '/api/v1/ai/trends',
    RECOMMENDATIONS: '/api/v1/ai/recommendations',
    RISK_ASSESSMENT: '/api/v1/ai/risk-assessment',
    PATTERNS: '/api/v1/ai/patterns',
  },

  // Reports
  REPORTS: {
    GLUCOSE_SUMMARY: '/api/v1/reports/glucose-summary',
    MEDICAL_REPORT: '/api/v1/reports/medical-report',
    EXPORT_DATA: '/api/v1/reports/export-data',
  },

  // Health Check
  HEALTH: {
    CHECK: '/health',
    ROOT: '/',
  },
} as const;
