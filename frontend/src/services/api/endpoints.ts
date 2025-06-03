import { apiClient } from './apiClient';
import { ENDPOINTS } from './config';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  User,
  GlucoseReading,
  CreateGlucoseReadingRequest,
  PaginatedResponse,
  PaginationParams
} from './types';

/**
 * API Endpoints for GlucoVision
 * Organized endpoint functions for different feature areas
 */

// Authentication Endpoints
export const authEndpoints = {
  login: (credentials: LoginRequest) => 
    apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials),
    
  register: (userData: RegisterRequest) => 
    apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, userData),
    
  refreshToken: (refreshToken: string) => 
    apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH, { refreshToken }),
    
  logout: () => 
    apiClient.post(ENDPOINTS.AUTH.LOGOUT),
    
  forgotPassword: (email: string) => 
    apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
    
  resetPassword: (token: string, password: string) => 
    apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
    
  verifyEmail: (token: string) => 
    apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),
};

// User Endpoints
export const userEndpoints = {
  getProfile: () => 
    apiClient.get<User>(ENDPOINTS.USER.PROFILE),
    
  updateProfile: (updates: Partial<User>) => 
    apiClient.put<User>(ENDPOINTS.USER.UPDATE_PROFILE, updates),
    
  changePassword: (currentPassword: string, newPassword: string) => 
    apiClient.post(ENDPOINTS.USER.CHANGE_PASSWORD, { currentPassword, newPassword }),
    
  deleteAccount: () => 
    apiClient.delete(ENDPOINTS.USER.DELETE_ACCOUNT),
};

// Glucose Endpoints
export const glucoseEndpoints = {
  createReading: (reading: CreateGlucoseReadingRequest) => 
    apiClient.post<GlucoseReading>(ENDPOINTS.GLUCOSE.READINGS, reading),
    
  getReadings: (params?: PaginationParams & { startDate?: string; endDate?: string }) => 
    apiClient.get<PaginatedResponse<GlucoseReading>>(ENDPOINTS.GLUCOSE.READINGS, { params }),
    
  getReading: (id: string) => 
    apiClient.get<GlucoseReading>(ENDPOINTS.GLUCOSE.READING(id)),
    
  updateReading: (id: string, updates: Partial<CreateGlucoseReadingRequest>) => 
    apiClient.put<GlucoseReading>(ENDPOINTS.GLUCOSE.READING(id), updates),
    
  deleteReading: (id: string) => 
    apiClient.delete(ENDPOINTS.GLUCOSE.READING(id)),
    
  getStatistics: (params: { startDate: string; endDate: string; groupBy?: string }) => 
    apiClient.get(ENDPOINTS.GLUCOSE.STATISTICS, { params }),
    
  getTrends: (params: { period: string; includePatterns?: boolean }) => 
    apiClient.get(ENDPOINTS.GLUCOSE.TRENDS, { params }),
    
  exportData: (params: { startDate: string; endDate: string; format: string }) => 
    apiClient.get(ENDPOINTS.GLUCOSE.EXPORT, { params, responseType: 'blob' }),
};

// Health Endpoints
export const healthEndpoints = {
  getMetrics: (params?: { startDate?: string; endDate?: string }) => 
    apiClient.get(ENDPOINTS.HEALTH.METRICS, { params }),
    
  createMetrics: (metrics: any) => 
    apiClient.post(ENDPOINTS.HEALTH.METRICS, metrics),
    
  getGoals: () => 
    apiClient.get(ENDPOINTS.HEALTH.GOALS),
    
  updateGoals: (goals: any) => 
    apiClient.put(ENDPOINTS.HEALTH.GOALS, goals),
    
  getReminders: () => 
    apiClient.get(ENDPOINTS.HEALTH.REMINDERS),
    
  createReminder: (reminder: any) => 
    apiClient.post(ENDPOINTS.HEALTH.REMINDERS, reminder),
};

// Analytics Endpoints
export const analyticsEndpoints = {
  getInsights: (params?: { period?: string; types?: string[] }) => 
    apiClient.get(ENDPOINTS.ANALYTICS.INSIGHTS, { params }),
    
  getReports: (params: { startDate: string; endDate: string; reportType: string }) => 
    apiClient.get(ENDPOINTS.ANALYTICS.REPORTS, { params }),
    
  getPredictions: (params: { horizon: string; includeFactors?: boolean }) => 
    apiClient.get(ENDPOINTS.ANALYTICS.PREDICTIONS, { params }),
};
