/**
 * GlucoVision User Context
 * ========================
 * 
 * Professional context for managing user profile data globally.
 * Integrates with AuthContext and provides clean state management.
 * 
 * Features:
 * - Global user profile state
 * - Onboarding data management
 * - Profile updates and caching
 * - Clean error handling
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { userService, UserProfile, OnboardingStatus } from '../services/user/userService';
import { useAuth } from './AuthContext';

// User state interface
interface UserState {
  profile: UserProfile | null;
  onboardingStatus: OnboardingStatus | null;
  isLoading: boolean;
  error: string | null;
}

// User actions
type UserAction =
  | { type: 'FETCH_PROFILE_START' }
  | { type: 'FETCH_PROFILE_SUCCESS'; payload: UserProfile }
  | { type: 'FETCH_PROFILE_FAILURE'; payload: string }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: UserProfile }
  | { type: 'SET_ONBOARDING_STATUS'; payload: OnboardingStatus }
  | { type: 'CLEAR_USER_DATA' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: UserState = {
  profile: null,
  onboardingStatus: null,
  isLoading: false,
  error: null,
};

// User reducer
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'FETCH_PROFILE_START':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
        error: null,
      };

    case 'FETCH_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.payload,
        error: null,
      };

    case 'SET_ONBOARDING_STATUS':
      return {
        ...state,
        onboardingStatus: action.payload,
      };

    case 'CLEAR_USER_DATA':
      return initialState;

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context interface
interface UserContextType {
  state: UserState;
  fetchProfile: (forceRefresh?: boolean) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchOnboardingStatus: () => Promise<void>;
  clearError: () => void;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider component
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch user profile
  const fetchProfile = async (forceRefresh = false) => {
    if (!authState.token) return;

    dispatch({ type: 'FETCH_PROFILE_START' });

    try {
      const profile = await userService.getUserProfile(authState.token, forceRefresh);
      dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: profile });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_PROFILE_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to fetch profile' 
      });
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.token) throw new Error('No authentication token');

    try {
      const updatedProfile = await userService.updateProfile(authState.token, updates);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedProfile });
    } catch (error) {
      throw error;
    }
  };

  // Fetch onboarding status
  const fetchOnboardingStatus = async () => {
    if (!authState.token) return;

    try {
      const status = await userService.getOnboardingStatus(authState.token);
      dispatch({ type: 'SET_ONBOARDING_STATUS', payload: status });
    } catch (error) {
      console.error('Failed to fetch onboarding status:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Auto-fetch profile when authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.token && !state.profile) {
      fetchProfile();
      fetchOnboardingStatus();
    }
  }, [authState.isAuthenticated, authState.token]);

  // Clear user data when logged out
  useEffect(() => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'CLEAR_USER_DATA' });
      userService.clearCache();
    }
  }, [authState.isAuthenticated]);

  const value: UserContextType = {
    state,
    fetchProfile,
    updateProfile,
    fetchOnboardingStatus,
    clearError,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
