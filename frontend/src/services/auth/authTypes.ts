/**
 * Authentication Types for GlucoVision
 * Additional types specific to authentication flow
 */

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

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
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

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

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
