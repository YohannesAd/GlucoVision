import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignUpCredentials } from '../types';

/**
 * AuthContext - Global authentication state management
 *
 * Features:
 * - User authentication state
 * - Login/logout functionality
 * - Token management
 * - Persistent login state
 * - Loading states for auth operations
 */

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_AUTH'; payload: { user: User; token: string } };

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    case 'LOGOUT':
      return initialState;

    case 'RESTORE_AUTH':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    default:
      return state;
  }
}

// Context Interface
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreAuth: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Use real API service to login
      const { authService } = await import('../services/auth/authService');
      const response = await authService.login(credentials);

      // Convert API response to context format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        hasCompletedOnboarding: response.user.has_completed_onboarding || false,
        createdAt: response.user.created_at,
        updatedAt: response.user.updated_at,
      };

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: response.tokens.accessToken }
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Sign up function
  const signUp = async (credentials: SignUpCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Use real API service to register
      const { authService } = await import('../services/auth/authService');
      const registerData = {
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        dateOfBirth: '', // Will be collected during onboarding
        agreeToTerms: true,
      };

      const response = await authService.register(registerData);

      // Convert API response to context format
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        hasCompletedOnboarding: response.user.has_completed_onboarding || false,
        createdAt: response.user.created_at,
        updatedAt: response.user.updated_at,
      };

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token: response.tokens.accessToken }
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Use real API service to logout
      const { authService } = await import('../services/auth/authService');
      await authService.logout();

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Complete onboarding for current user
  const completeOnboarding = async () => {
    try {
      if (state.user && state.token) {
        // Call backend to get updated user info after onboarding completion
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get updated user information');
        }

        const data = await response.json();
        const updatedUser: User = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          hasCompletedOnboarding: data.user.has_completed_onboarding,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
        };

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: updatedUser, token: state.token }
        });
      }
    } catch (error) {
      console.error('Complete onboarding error:', error);
      throw error;
    }
  };

  // Restore authentication on app start
  const restoreAuth = async () => {
    try {
      // TODO: Get stored token and validate
      // const token = await SecureStore.getItemAsync('authToken');
      // if (token) {
      //   const user = await authService.validateToken(token);
      //   dispatch({ type: 'RESTORE_AUTH', payload: { user, token } });
      // }
    } catch (error) {
      console.error('Auth restoration error:', error);
    }
  };

  // Restore auth on app start
  useEffect(() => {
    restoreAuth();
  }, []);

  const value: AuthContextType = {
    state,
    login,
    signUp,
    logout,
    restoreAuth,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
