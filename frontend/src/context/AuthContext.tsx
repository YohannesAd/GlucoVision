import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignUpCredentials } from '../types';
import { authService } from '../services/auth/authService';

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_AUTH'; payload: { user: User; token: string } };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token, error: null };
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, isAuthenticated: false, user: null, token: null, error: action.payload };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return initialState;
    case 'RESTORE_AUTH':
      return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token, error: null };
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
  clearError: () => void;
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
    // Don't dispatch AUTH_START to avoid loading state that affects navigation

    try {
      // Use real API service to login
      const response = await authService.login(credentials);

      // AuthService already converts FastAPI response to frontend User format
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.tokens.accessToken }
      });

    } catch (error: any) {
      // Clear any stored tokens on login failure to prevent refresh attempts
      try {
        await authService.clearAuthData();
      } catch (clearError) {
        console.warn('Failed to clear auth data:', clearError);
      }

      // Throw error so LoginScreen can handle it immediately
      throw error;
    }
  };

  // Sign up function
  const signUp = async (credentials: SignUpCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Use real API service to register
      const registerData = {
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        dateOfBirth: '', // Will be collected during onboarding
        agreeToTerms: true,
      };

      const response = await authService.register(registerData);

      // AuthService already converts FastAPI response to frontend User format
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.tokens.accessToken }
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
        // Update user's onboarding status locally
        const updatedUser: User = {
          ...state.user,
          hasCompletedOnboarding: true,
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

  // Clear authentication error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
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
    clearError,
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
    console.error('useAuth must be used within an AuthProvider');
    // Return a default context instead of throwing to prevent crashes
    return {
      state: initialState,
      login: async () => {},
      signUp: async () => {},
      logout: async () => {},
      restoreAuth: async () => {},
      completeOnboarding: async () => {},
      clearError: () => {},
    };
  }
  return context;
}
