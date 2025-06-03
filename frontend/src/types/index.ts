// Navigation Types
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  OnboardingPersonalInfo: undefined;
  OnboardingMedicalInfo: undefined;
  OnboardingPreferences: undefined;
  Dashboard: undefined;
  AddLog: undefined;
  ViewLogs: undefined;
  AITrends: undefined;
  Profile: undefined;
  Reports: undefined;
};

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  diabetesType?: 'type1' | 'type2' | 'gestational' | 'other';
  diagnosisDate?: string;
  createdAt: string;
  updatedAt: string;
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
}
