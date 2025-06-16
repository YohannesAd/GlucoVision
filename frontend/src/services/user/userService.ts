/**
 * GlucoVision User Service
 * ========================
 * 
 * service for user profile and onboarding data management.
 * Handles user information retrieval, caching, and profile updates.
 */

import { API_BASE_URL } from '../api/config';

// User profile interfaces
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  hasCompletedOnboarding: boolean;
  dateOfBirth?: string;
  gender?: string;
  diabetesType?: string;
  diagnosisDate?: string;
  mealsPerDay?: number;
  activityLevel?: string;
  usesInsulin?: boolean;
  currentMedications?: string[];
  sleepDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  nextStep?: string;
}

class UserService {
  private baseUrl: string;
  private profileCache: UserProfile | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get user profile with caching
   */
  async getUserProfile(token: string, forceRefresh = false): Promise<UserProfile> {
    // Check cache validity
    const now = Date.now();
    if (!forceRefresh && this.profileCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.profileCache;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      
      // Transform backend response to frontend format
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        hasCompletedOnboarding: data.has_completed_onboarding,
        dateOfBirth: data.date_of_birth,
        gender: data.gender,
        diabetesType: data.diabetes_type,
        diagnosisDate: data.diagnosis_date,
        mealsPerDay: data.meals_per_day,
        activityLevel: data.activity_level,
        usesInsulin: data.uses_insulin,
        currentMedications: data.current_medications,
        sleepDuration: data.sleep_duration,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      // Update cache
      this.profileCache = profile;
      this.cacheTimestamp = now;

      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Get onboarding status
   */
  async getOnboardingStatus(token: string): Promise<OnboardingStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/onboarding/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch onboarding status');
      }

      const data = await response.json();
      return {
        hasCompletedOnboarding: data.has_completed_onboarding,
        currentStep: data.current_step,
        totalSteps: data.total_steps,
        nextStep: data.next_step,
      };
    } catch (error) {
      console.error('Get onboarding status error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(token: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      const data = await response.json();
      
      // Clear cache to force refresh
      this.clearCache();
      
      return await this.getUserProfile(token, true);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Clear profile cache
   */
  clearCache(): void {
    this.profileCache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Get cached profile (if available)
   */
  getCachedProfile(): UserProfile | null {
    const now = Date.now();
    if (this.profileCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.profileCache;
    }
    return null;
  }
}
export const userService = new UserService();
