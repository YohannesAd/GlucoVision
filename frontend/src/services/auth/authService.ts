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
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
        return response.data;
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
      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        userData
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
        return response.data;
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

      const response = await apiClient.post<AuthResponse>(
        ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      if (response.success && response.data) {
        await this.storeAuthData(response.data);
        return response.data.tokens.accessToken;
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
    if (error.code === 'INVALID_CREDENTIALS') {
      return new Error('Invalid email or password');
    } else if (error.code === 'EMAIL_ALREADY_EXISTS') {
      return new Error('An account with this email already exists');
    } else if (error.code === 'WEAK_PASSWORD') {
      return new Error('Password is too weak');
    } else if (error.code === 'NETWORK_ERROR') {
      return new Error('Network error - please check your connection');
    }
    
    return new Error(error.message || 'Authentication failed');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
