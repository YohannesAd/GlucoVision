/**
 * GlucoVision Onboarding Service
 * ==============================
 * 
 * Professional service for handling user onboarding process.
 * Manages the 3-step onboarding flow with backend integration.
 * 
 * Features:
 * - Step-by-step onboarding data submission
 * - Backend API integration
 * - Error handling and validation
 * - Onboarding status tracking
 */

import { API_BASE_URL } from '../api/config';

// Onboarding data types
export interface OnboardingStep1Data {
  dateOfBirth: string; // ISO date string
  gender: 'male' | 'female' | 'other';
  diabetesType: 'type1' | 'type2' | 'gestational' | 'other';
  diagnosisDate: string; // ISO date string (year)
}

export interface OnboardingStep2Data {
  mealsPerDay: number;
  activityLevel: 'low' | 'moderate' | 'high';
  usesInsulin: boolean;
  currentMedications: string[];
  sleepDuration: number;
}

export interface GlucoseReading {
  value: number;
  timeOfDay: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime';
  recordedAt?: string; // ISO date string
}

export interface OnboardingStep3Data {
  glucoseReadings: GlucoseReading[];
  preferredUnit: 'mg/dL' | 'mmol/L';
  targetRangeMin?: number;
  targetRangeMax?: number;
}

export interface OnboardingStatusResponse {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  nextStep?: string;
}

/**
 * Onboarding Service Class
 * 
 * Handles all onboarding-related API calls and data management.
 */
class OnboardingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1/users`;
  }

  /**
   * Get user's current onboarding status
   */
  async getOnboardingStatus(token: string): Promise<OnboardingStatusResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/onboarding/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get onboarding status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get onboarding status error:', error);
      throw error;
    }
  }

  /**
   * Submit onboarding step 1 data
   */
  async submitStep1(data: OnboardingStep1Data, token: string): Promise<any> {
    try {
      const payload = {
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        diabetes_type: data.diabetesType,
        diagnosis_date: data.diagnosisDate,
      };

      const response = await fetch(`${this.baseUrl}/onboarding/step1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit step 1 data');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit step 1 error:', error);
      throw error;
    }
  }

  /**
   * Submit onboarding step 2 data
   */
  async submitStep2(data: OnboardingStep2Data, token: string): Promise<any> {
    try {
      const payload = {
        meals_per_day: data.mealsPerDay,
        activity_level: data.activityLevel,
        uses_insulin: data.usesInsulin,
        current_medications: data.currentMedications,
        sleep_duration: data.sleepDuration,
      };

      const response = await fetch(`${this.baseUrl}/onboarding/step2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit step 2 data');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit step 2 error:', error);
      throw error;
    }
  }

  /**
   * Map frontend time of day values to backend reading types
   */
  private mapTimeOfDayToReadingType(timeOfDay: string): string {
    const mapping: { [key: string]: string } = {
      'Fasting': 'fasting',
      'Before Meal': 'before_meal',
      'After Meal': 'after_meal',
      'Bedtime': 'bedtime',
      'Random': 'random',
    };
    return mapping[timeOfDay] || timeOfDay.toLowerCase().replace(' ', '_');
  }

  /**
   * Submit onboarding step 3 data and complete onboarding
   */
  async submitStep3(data: OnboardingStep3Data, token: string): Promise<any> {
    try {
      // Convert frontend data format to backend expected format
      const payload = {
        glucose_readings: data.glucoseReadings.map(reading => ({
          glucose_value: reading.value,
          reading_time: reading.recordedAt || new Date().toISOString(),
          reading_type: this.mapTimeOfDayToReadingType(reading.timeOfDay),
        })),
        preferred_unit: data.preferredUnit,
        target_range_min: data.targetRangeMin || 80,
        target_range_max: data.targetRangeMax || 180,
      };

      const response = await fetch(`${this.baseUrl}/onboarding/step3`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to complete onboarding');
      }

      return await response.json();
    } catch (error) {
      console.error('Submit step 3 error:', error);
      throw error;
    }
  }

  /**
   * Skip onboarding (for testing purposes)
   */
  async skipOnboarding(token: string): Promise<any> {
    try {
      // Submit minimal data to complete onboarding
      const defaultStep1: OnboardingStep1Data = {
        dateOfBirth: '1990-01-01',
        gender: 'other',
        diabetesType: 'type2',
        diagnosisDate: '2020-01-01',
      };

      const defaultStep2: OnboardingStep2Data = {
        mealsPerDay: 3,
        activityLevel: 'moderate',
        usesInsulin: false,
        currentMedications: [],
        sleepDuration: 8,
      };

      const defaultStep3: OnboardingStep3Data = {
        glucoseReadings: [
          { value: 100, timeOfDay: 'Fasting' },
          { value: 120, timeOfDay: 'Before Meal' },
          { value: 140, timeOfDay: 'After Meal' },
          { value: 110, timeOfDay: 'Bedtime' },
        ],
        preferredUnit: 'mg/dL',
        targetRangeMin: 80,
        targetRangeMax: 180,
      };

      // Submit all steps
      await this.submitStep1(defaultStep1, token);
      await this.submitStep2(defaultStep2, token);
      const result = await this.submitStep3(defaultStep3, token);

      return result;
    } catch (error) {
      console.error('Skip onboarding error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();
export default onboardingService;
