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
      // TODO: Implement actual API call
      // const response = await authService.login(credentials);

      // Simulate API call for now
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        hasCompletedOnboarding: true, // Existing users have completed onboarding
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: mockUser, token: mockToken }
      });

      // TODO: Store token securely
      // await SecureStore.setItemAsync('authToken', mockToken);

    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' });
      throw error;
    }
  };

  // Sign up function
  const signUp = async (credentials: SignUpCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // TODO: Implement actual API call
      // const response = await authService.signUp(credentials);

      // Create new user without completing onboarding yet
      const newUser: User = {
        id: Date.now().toString(), // Temporary ID generation
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        hasCompletedOnboarding: false, // New users need to complete onboarding
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token-new-user';

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: newUser, token: mockToken }
      });

      // TODO: Store token securely
      // await SecureStore.setItemAsync('authToken', mockToken);

    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Sign up failed' });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // TODO: Clear stored token
      // await SecureStore.deleteItemAsync('authToken');

      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Complete onboarding for current user
  const completeOnboarding = async () => {
    try {
      if (state.user) {
        const updatedUser: User = {
          ...state.user,
          hasCompletedOnboarding: true,
          updatedAt: new Date().toISOString(),
        };

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: updatedUser, token: state.token || '' }
        });

        // TODO: Update user in backend
        // await authService.updateUser(updatedUser);
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
