// Central export point for all services

// API exports (excluding conflicting types)
export * from './api/apiClient';
export * from './api/endpoints';
export * from './api/interceptors';

// API types with explicit naming to avoid conflicts
export {
  LoginRequest as APILoginRequest,
  RegisterRequest as APIRegisterRequest,
  User as APIUser,
  GlucoseReading,
  CreateGlucoseReadingRequest,
  PaginatedResponse,
  PaginationParams,
  FastAPIAuthResponse,
  FastAPIUser,
  UserPreferences as APIUserPreferences
} from './api/types';

// Auth exports with explicit AuthResponse (primary auth types)
export * from './auth/authService';
export {
  AuthState,
  User,
  UserPreferences,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenPayload,
  PasswordResetRequest,
  PasswordResetConfirm,
  EmailVerificationRequest,
  ChangePasswordRequest
} from './auth/authTypes';

// Other service exports
export * from './glucose';
export * from './storage';
export * from './analytics';
export * from './notifications';
export * from './validation';
export * from './onboarding';
export * from './chat';
