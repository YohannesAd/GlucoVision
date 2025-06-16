import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { userService, UserProfile, OnboardingStatus } from '../services/user/userService';
import { useAuth } from './AuthContext';

interface UserState {
  profile: UserProfile | null;
  onboardingStatus: OnboardingStatus | null;
  isLoading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'FETCH_PROFILE_START' }
  | { type: 'FETCH_PROFILE_SUCCESS'; payload: UserProfile }
  | { type: 'FETCH_PROFILE_FAILURE'; payload: string }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: UserProfile }
  | { type: 'SET_ONBOARDING_STATUS'; payload: OnboardingStatus }
  | { type: 'CLEAR_USER_DATA' }
  | { type: 'CLEAR_ERROR' };

const initialState: UserState = {
  profile: null,
  onboardingStatus: null,
  isLoading: false,
  error: null,
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'FETCH_PROFILE_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_PROFILE_SUCCESS':
      return { ...state, profile: action.payload, isLoading: false, error: null };
    case 'FETCH_PROFILE_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPDATE_PROFILE_SUCCESS':
      return { ...state, profile: action.payload, error: null };
    case 'SET_ONBOARDING_STATUS':
      return { ...state, onboardingStatus: action.payload };
    case 'CLEAR_USER_DATA':
      return initialState;
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface UserContextType {
  state: UserState;
  fetchProfile: (forceRefresh?: boolean) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  fetchOnboardingStatus: () => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const authContext = useAuth();
  const authState = authContext?.state || { token: null, isAuthenticated: false };

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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.token) throw new Error('No authentication token');
    try {
      const updatedProfile = await userService.updateProfile(authState.token, updates);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedProfile });
    } catch (error) {
      throw error;
    }
  };

  const fetchOnboardingStatus = async () => {
    if (!authState.token) return;
    try {
      const status = await userService.getOnboardingStatus(authState.token);
      dispatch({ type: 'SET_ONBOARDING_STATUS', payload: status });
    } catch (error) {
      console.error('Failed to fetch onboarding status:', error);
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  useEffect(() => {
    if (authState.isAuthenticated && authState.token && !state.profile) {
      fetchProfile();
      fetchOnboardingStatus();
    }
  }, [authState.isAuthenticated, authState.token]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      dispatch({ type: 'CLEAR_USER_DATA' });
      userService.clearCache();
    }
  }, [authState.isAuthenticated]);

  return (
    <UserContext.Provider value={{
      state,
      fetchProfile,
      updateProfile,
      fetchOnboardingStatus,
      clearError,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    console.error('useUser must be used within a UserProvider');
    // Return a default context instead of throwing to prevent crashes
    return {
      state: initialState,
      fetchProfile: async () => {},
      updateProfile: async () => {},
      fetchOnboardingStatus: async () => {},
      clearError: () => {},
    };
  }
  return context;
}
