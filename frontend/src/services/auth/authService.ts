import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/config';
import { LoginRequest, RegisterRequest, AuthResponse, FastAPIAuthResponse, FastAPITokenResponse, FastAPIUser } from '../api/types';
import { User } from '../../types';
import { storageService } from '../storage/storageService';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Convert FastAPI response to frontend User format
  private convertFastAPIUserToUser(fastApiUser: FastAPIUser): User {
    return {
      id: fastApiUser.id,
      email: fastApiUser.email,
      firstName: fastApiUser.first_name || '',
      lastName: fastApiUser.last_name || '',
      dateOfBirth: fastApiUser.date_of_birth,
      gender: fastApiUser.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined,
      diabetesType: fastApiUser.diabetes_type as 'type1' | 'type2' | 'gestational' | 'other' | undefined,
      profilePicture: undefined,
      isEmailVerified: fastApiUser.is_verified || false,
      hasCompletedOnboarding: fastApiUser.has_completed_onboarding || false,
      createdAt: fastApiUser.created_at,
      updatedAt: fastApiUser.updated_at,
      preferences: {
        glucoseUnit: (fastApiUser.preferred_unit as 'mg/dL' | 'mmol/L') || 'mg/dL',
        theme: 'system' as const,
        notifications: { reminders: true, insights: true, emergencyAlerts: true },
        privacy: { shareData: false, analytics: true },
        language: 'en',
      },
    };
  }

  // User login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<FastAPIAuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data?.tokens) {
        const authData: AuthResponse = {
          user: this.convertFastAPIUserToUser(response.data.user),
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

  // User registration
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const registerData = {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      };
      const response = await apiClient.post<FastAPIAuthResponse>(ENDPOINTS.AUTH.REGISTER, registerData);
      if (response.data?.tokens) {
        const authData: AuthResponse = {
          user: this.convertFastAPIUserToUser(response.data.user),
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

  // User logout
  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Server logout failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  // Refresh authentication token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await storageService.getSecureItem(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await apiClient.post<FastAPITokenResponse>(ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken });
      if (response.data?.access_token) {
        const authData: AuthResponse = {
          user: await this.getCurrentUser() || {} as any,
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

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await storageService.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check authentication status
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storageService.getSecureItem(this.TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Get stored auth token
  async getAuthToken(): Promise<string | null> {
    try {
      return await storageService.getSecureItem(this.TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  // Initiate password reset
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password: newPassword });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Change password for authenticated user
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      await apiClient.post(
        ENDPOINTS.AUTH.CHANGE_PASSWORD,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Store authentication data securely
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

  // Clear all authentication data
  async clearAuthData(): Promise<void> {
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

  // Handle authentication errors
  private handleAuthError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.response.data?.message;

      const errorMessages: Record<number, string> = {
        400: detail?.includes('Password must contain') ? 'Password must contain uppercase, lowercase, and numeric characters'
           : detail?.includes('Password must be at least') ? 'Password must be at least 8 characters long'
           : detail?.includes('Passwords do not match') ? 'Passwords do not match'
           : detail?.includes('Email already registered') ? 'An account with this email already exists'
           : detail || 'Invalid input. Please check your information.',
        401: detail || 'Invalid email or password',
        403: 'Account is deactivated',
        404: 'Service not found. Please try again later.',
        422: error.response.data?.detail?.[0]?.msg || 'Invalid input format',
        500: 'Server error. Please try again later.',
      };

      return new Error(errorMessages[status] || detail || 'Authentication failed');
    }

    if (error.request) return new Error('Network error. Please check your internet connection.');
    return new Error(error.message || 'Authentication failed');
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
