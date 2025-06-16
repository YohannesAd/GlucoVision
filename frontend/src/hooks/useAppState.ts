import { useState, useCallback, useEffect } from 'react';
import { useAPI, API_ENDPOINTS } from './useAPI';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useGlucose } from '../context/GlucoseContext';

/**
 * useAppState Hook - Universal state management
 * Handles auth, glucose, user, app preferences with persistence

 */

// State modules
type StateModule = 'auth' | 'glucose' | 'user' | 'app';

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Glucose state
interface GlucoseState {
  logs: any[];
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
}

// User state
interface UserState {
  profile: any | null;
  preferences: any | null;
  isLoading: boolean;
  error: string | null;
}

// App state
interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  glucoseUnit: 'mg/dL' | 'mmol/L';
  notificationsEnabled: boolean;
  isOnline: boolean;
  globalLoading: boolean;
}

// Combined state
interface CombinedState {
  auth: AuthState;
  glucose: GlucoseState;
  user: UserState;
  app: AppState;
}

// Initial states
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null
};

const initialGlucoseState: GlucoseState = {
  logs: [],
  isLoading: false,
  lastSync: null,
  error: null
};

const initialUserState: UserState = {
  profile: null,
  preferences: null,
  isLoading: false,
  error: null
};

const initialAppState: AppState = {
  theme: 'light',
  language: 'en',
  glucoseUnit: 'mg/dL',
  notificationsEnabled: true,
  isOnline: true,
  globalLoading: false
};

const initialState: CombinedState = {
  auth: initialAuthState,
  glucose: initialGlucoseState,
  user: initialUserState,
  app: initialAppState
};

// Hook implementation
export function useAppState(module?: StateModule) {
  // Connect to existing contexts with safety checks
  const authContext = useAuth();
  const userContext = useUser();
  const glucoseContext = useGlucose();

  // Safety check - if contexts are not available, return safe defaults
  if (!authContext || !userContext || !glucoseContext) {
    console.warn('useAppState: Some contexts are not available, using fallback state');
  }

  const [appState, setAppState] = useState<AppState>(initialAppState);
  const { request } = useAPI();

  // Create combined state from contexts
  const state: CombinedState = {
    auth: {
      isAuthenticated: authContext?.state?.isAuthenticated || false,
      user: authContext?.state?.user || null,
      token: authContext?.state?.token || null,
      isLoading: authContext?.state?.isLoading || false,
      error: authContext?.state?.error || null
    },
    glucose: {
      logs: glucoseContext?.state?.logs || [],
      isLoading: glucoseContext?.state?.isLoading || false,
      lastSync: glucoseContext?.state?.lastSync || null,
      error: glucoseContext?.state?.error || null
    },
    user: {
      profile: userContext?.state?.profile || null,
      preferences: userContext?.state?.preferences || null,
      isLoading: userContext?.state?.isLoading || false,
      error: userContext?.state?.error || null
    },
    app: appState
  };

  // Generic state updater for app state only (others use contexts)
  const updateState = useCallback((module: StateModule, updates: Partial<any>) => {
    if (module === 'app') {
      setAppState(prev => ({ ...prev, ...updates }));
    }
    // Other modules are handled by their respective contexts
  }, []);

  // Auth actions - delegate to context
  const authActions = {
    login: authContext?.login || (async () => {}),
    signup: authContext?.signUp || (async () => {}),
    logout: authContext?.logout || (async () => {}),
    resetPassword: async (data: any) => {
      // TODO: Implement reset password in AuthContext
      console.log('Reset password:', data);
      return { success: true };
    },
    changePassword: async (data: any) => {
      // TODO: Implement change password in AuthContext
      console.log('Change password:', data);
      return { success: true };
    },
    clearError: authContext?.clearError || (() => {})
  };

  // Glucose actions - delegate to context with token
  const glucoseActions = {
    fetchLogs: async () => {
      if (!state.auth.token) {
        throw new Error('No authentication token');
      }
      return glucoseContext?.fetchLogs(state.auth.token) || Promise.resolve();
    },
    addLog: async (logData: any) => {
      if (!state.auth.token) {
        throw new Error('No authentication token');
      }
      return glucoseContext?.addLog(logData, state.auth.token) || Promise.resolve();
    },
    getRecentLogs: (days: number) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return state.glucose.logs.filter(log =>
        new Date(log.timestamp) >= cutoffDate
      );
    }
  };

  // User actions - delegate to context with onboarding methods
  const userActions = {
    fetchProfile: userContext?.fetchProfile || (async () => {}),
    updateProfile: userContext?.updateProfile || (async () => {}),

    // Onboarding methods - keep these for now
    updateOnboardingStep1: async (step1Data: any) => {
      const result = await request({
        endpoint: API_ENDPOINTS.USER.ONBOARDING_STEP1,
        method: 'POST',
        data: step1Data,
        token: state.auth.token || undefined,
        showSuccessAlert: false
      });

      return result;
    },

    updateOnboardingStep2: async (step2Data: any) => {
      const result = await request({
        endpoint: API_ENDPOINTS.USER.ONBOARDING_STEP2,
        method: 'POST',
        data: step2Data,
        token: state.auth.token || undefined,
        showSuccessAlert: false
      });

      return result;
    },

    completeOnboarding: async (step3Data: any) => {
      const result = await request({
        endpoint: API_ENDPOINTS.USER.ONBOARDING_STEP3,
        method: 'POST',
        data: step3Data,
        token: state.auth.token || undefined,
        showSuccessAlert: false
      });

      if (result.success && authContext?.completeOnboarding) {
        await authContext.completeOnboarding();
      }

      return result;
    }
  };

  // App actions - these stay local to this hook
  const appActions = {
    setTheme: (theme: 'light' | 'dark' | 'system') => {
      updateState('app', { theme });
      // TODO: Save to storage
    },

    setGlucoseUnit: (unit: 'mg/dL' | 'mmol/L') => {
      updateState('app', { glucoseUnit: unit });
      // TODO: Save to storage
    },

    toggleNotifications: (enabled: boolean) => {
      updateState('app', { notificationsEnabled: enabled });
      // TODO: Save to storage
    },

    setGlobalLoading: (loading: boolean) => {
      updateState('app', { globalLoading: loading });
    }
  };

  // Return specific module or all
  if (module) {
    const moduleState = state[module];
    const moduleActions = {
      auth: authActions,
      glucose: glucoseActions,
      user: userActions,
      app: appActions
    }[module];

    return {
      state: moduleState,
      actions: moduleActions,
      updateState: (updates: any) => updateState(module, updates)
    };
  }

  return {
    state,
    auth: { state: state.auth, actions: authActions },
    glucose: { state: state.glucose, actions: glucoseActions },
    user: { state: state.user, actions: userActions },
    app: { state: state.app, actions: appActions },
    updateState
  };
}
