// Navigation Types
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;

  // Password Reset Flow
  ForgotPassword: undefined;
  VerifyResetCode: { email: string };
  ResetPassword: { token: string; email: string };
  ResetPasswordSuccess: { email: string };

  OnboardingPersonalInfo1: undefined;
  OnboardingPersonalInfo2: undefined;
  OnboardingPersonalInfo3: undefined;

  // Main App Navigation
  MainTabs: undefined;
  Dashboard: undefined;
  AddLog: undefined;
  ViewLogs: undefined;
  AITrends: undefined;
  AIChat: undefined;
  Profile: undefined;
  Account: undefined;
  Reports: undefined;
};

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  diabetesType?: 'type1' | 'type2' | 'gestational' | 'other';
  diagnosisDate?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  hasCompletedOnboarding: boolean;
  preferences?: UserPreferences;
  medicalInfo?: UserMedicalInfo;
  createdAt: string;
  updatedAt: string;
}

// User Preferences Types
export interface UserPreferences {
  glucoseUnit: 'mg/dL' | 'mmol/L';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    reminders: boolean;
    insights: boolean;
    emergencyAlerts: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  language: string;
}

// User Medical Information Types
export interface UserMedicalInfo {
  diabetesType: 'type1' | 'type2' | 'gestational' | 'other';
  diagnosisDate: string;
  currentMedications: string[];
  takesInsulin: boolean;
  insulinType?: string;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  mealsPerDay: number;
  sleepDuration: number;
  allergies?: string[];
}

// Glucose Log Types
export interface GlucoseLog {
  id: string;
  userId: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  logType: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
  notes?: string;
  timestamp: string;
  createdAt: string;
}

// Onboarding Types
export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  };
  medicalInfo: {
    diabetesType: 'type1' | 'type2' | 'gestational' | 'other';
    diagnosisDate: string;
    currentMedications: string[];
    allergies?: string[];
  };
  preferences: {
    preferredUnit: 'mg/dL' | 'mmol/L';
    reminderTimes: string[];
    targetRange: {
      min: number;
      max: number;
    };
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// AI & Analytics Types
export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'trend' | 'alert' | 'prediction';
  title: string;
  message: string;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
  severity: 'positive' | 'warning' | 'critical' | 'info';
  createdAt: string;
  factors?: string[];
}

export interface TrendData {
  period: 'week' | 'month' | 'quarter';
  direction: 'improving' | 'stable' | 'declining';
  percentage: number;
  timeInRange: number;
  averageGlucose: number;
  readingsCount: number;
  patterns: string[];
}

export interface PredictionData {
  horizon: 'hour' | 'day' | 'week';
  predictedValue: number;
  confidence: number;
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }[];
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  confidence?: number;
  relatedInsights?: string[];
}
