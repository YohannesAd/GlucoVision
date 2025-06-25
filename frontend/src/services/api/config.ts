/**
 * API Configuration for GlucoVision
 * Centralized configuration for all API-related settings
 */

// Environment-based configuration with smart fallback
const getApiBaseUrl = (): string => {
  // Check environment variable first (highest priority)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  console.log('🔍 Config checking environment API URL:', envUrl);

  if (envUrl) {
    const isRailway = envUrl.includes('railway.app');
    const isLocal = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
    const isNetwork = envUrl.includes('10.0.0') || envUrl.includes('192.168');

    if (isRailway) {
      console.log('🚀 Config using Railway backend:', envUrl);
    } else if (isLocal) {
      console.log('🔧 Config using local backend:', envUrl);
    } else if (isNetwork) {
      console.log('📱 Config using network backend:', envUrl);
    } else {
      console.log('✅ Config using custom backend:', envUrl);
    }

    return envUrl;
  }

  // Fallback logic when no environment variable is set
  const isDevelopment = __DEV__;
  if (isDevelopment) {
    console.log('⚠️  No EXPO_PUBLIC_API_URL set, falling back to localhost');
    return 'http://localhost:8000'; // Local FastAPI development server
  }

  console.log('⚠️  No EXPO_PUBLIC_API_URL set, falling back to Railway production');
  return 'https://glucovision-production.up.railway.app'; // Production (Railway)
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
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    ME: '/api/v1/auth/me',
    VERIFY_TOKEN: '/api/v1/auth/verify-token',
  },

  // User Management
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile',
    CHANGE_PASSWORD: '/api/v1/users/change-password',
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
    CHAT: '/api/v1/ai/chat',
    CONVERSATIONS: '/api/v1/ai/conversations',
  },

  // Reports
  REPORTS: {
    GLUCOSE_SUMMARY: '/api/v1/reports/glucose-summary',
    MEDICAL_REPORT: '/api/v1/reports/medical-report',
    EXPORT_DATA: '/api/v1/reports/export-data',
  },

  // Health Check & Metrics
  HEALTH: {
    CHECK: '/health',
    ROOT: '/',
    METRICS: '/api/v1/health/metrics',
    GOALS: '/api/v1/health/goals',
    REMINDERS: '/api/v1/health/reminders',
  },

  // Analytics
  ANALYTICS: {
    INSIGHTS: '/api/v1/analytics/insights',
    REPORTS: '/api/v1/analytics/reports',
    PREDICTIONS: '/api/v1/analytics/predictions',
  },
} as const;
