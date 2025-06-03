/**
 * API Types and Interfaces for GlucoVision
 * Comprehensive type definitions for all API responses and requests
 */

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

// API Error interface
export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: Record<string, any>;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  units: 'mg/dL' | 'mmol/L';
  notifications: {
    reminders: boolean;
    insights: boolean;
    emergencyAlerts: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
}

// Glucose Types
export interface GlucoseReading {
  id: string;
  userId: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  timestamp: string;
  notes?: string;
  tags?: string[];
  mealContext?: 'before_meal' | 'after_meal' | 'fasting' | 'bedtime';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGlucoseReadingRequest {
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  timestamp: string;
  notes?: string;
  tags?: string[];
  mealContext?: 'before_meal' | 'after_meal' | 'fasting' | 'bedtime';
}

export interface GlucoseStatistics {
  average: number;
  min: number;
  max: number;
  standardDeviation: number;
  timeInRange: {
    low: number;
    normal: number;
    high: number;
  };
  period: {
    start: string;
    end: string;
  };
}

// Health Metrics Types
export interface HealthMetrics {
  weight?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  steps?: number;
  sleep?: {
    duration: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  timestamp: string;
}

// Analytics Types
export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'pattern' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations?: string[];
  createdAt: string;
}
