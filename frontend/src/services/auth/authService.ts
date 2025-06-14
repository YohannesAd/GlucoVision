import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/config';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User 
} from '../api/types';
import { storageService } from '../storage/storageService';

/**
 * Authentication Service for GlucoVision
 * Handles all authentication-related operations
 */
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(
        ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // FastAPI returns data directly, not wrapped in success/data
      if (response.data && response.data.tokens) {
        const authData: AuthResponse = {
          user: response.data.user,
          tokens: {
            accessToken: response.data.tokens.access_token,
            refreshToken: response.data.tokens.refresh_token,
            expiresIn: response.data.tokens.expires_in,
          }
        };

        await this.storeAuthData(authData);
        return authData;
      }

      throw new Error('Login failed');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Transform frontend data to match FastAPI schema
      const registerData = {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.password, // FastAPI expects confirm_password
        first_name: userData.firstName,
        last_name: userData.lastName,
      };

      const response = await apiClient.post(
        ENDPOINTS.AUTH.REGISTER,
        registerData
      );

      // FastAPI returns data directly
      if (response.data && response.data.tokens) {
        const authData: AuthResponse = {
          user: response.data.user,
          tokens: {
            accessToken: response.data.tokens.access_token,
            refreshToken: response.data.tokens.refresh_token,
            expiresIn: response.data.tokens.expires_in,
          }
        };

        await this.storeAuthData(authData);
        return authData;
      }

      throw new Error('Registration failed');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server call fails
      console.warn('Server logout failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await storageService.getSecureItem(this.REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(
        ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken } // FastAPI expects refresh_token
      );

      // FastAPI returns tokens directly
      if (response.data && response.data.access_token) {
        const authData: AuthResponse = {
          user: await this.getCurrentUser() || {} as any, // Keep existing user data
          tokens: {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
          }
        };

        await this.storeAuthData(authData);
        return authData.tokens.accessToken;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      await this.clearAuthData();
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await storageService.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storageService.getSecureItem(this.TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored auth token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await storageService.getSecureItem(this.TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password: newPassword,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Store authentication data securely
   */
  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await Promise.all([
        storageService.setSecureItem(this.TOKEN_KEY, authData.tokens.accessToken),
        storageService.setSecureItem(this.REFRESH_TOKEN_KEY, authData.tokens.refreshToken),
        storageService.setItem(this.USER_KEY, JSON.stringify(authData.user)),
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        storageService.removeSecureItem(this.TOKEN_KEY),
        storageService.removeSecureItem(this.REFRESH_TOKEN_KEY),
        storageService.removeItem(this.USER_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    console.log('Auth error details:', error);

    // Handle Axios errors
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.message;

      switch (status) {
        case 400:
          // Bad request - validation errors
          if (detail) {
            if (detail.includes('Password must contain')) {
              return new Error('Password must contain uppercase, lowercase, and numeric characters');
            } else if (detail.includes('Password must be at least')) {
              return new Error('Password must be at least 8 characters long');
            } else if (detail.includes('Passwords do not match')) {
              return new Error('Passwords do not match');
            } else if (detail.includes('Email already registered')) {
              return new Error('An account with this email already exists');
            }
            return new Error(detail);
          }
          return new Error('Invalid input. Please check your information.');

        case 401:
          return new Error('Invalid email or password');

        case 403:
          return new Error('Account is deactivated');

        case 404:
          return new Error('Service not found. Please try again later.');

        case 422:
          // Validation error
          if (error.response.data?.detail?.[0]?.msg) {
            return new Error(error.response.data.detail[0].msg);
          }
          return new Error('Invalid input format');

        case 500:
          return new Error('Server error. Please try again later.');

        default:
          return new Error(detail || 'Authentication failed');
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your internet connection.');
    } else {
      // Other errors
      return new Error(error.message || 'Authentication failed');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
