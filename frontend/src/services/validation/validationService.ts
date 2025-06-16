import { z } from 'zod';

/**
 * Validation Service for GlucoVision
 * Provides utility functions for data validation and sanitization
 */
class ValidationService {
  /**
   * Validate data against a Zod schema
   */
  async validate<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
  }> {
    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        
        return {
          success: false,
          errors,
        };
      }
      
      return {
        success: false,
        errors: { general: 'Validation failed' },
      };
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain at least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain at least one number');
    }

    return {
      isValid: score >= 3, // Only require length, uppercase, lowercase, and number
      score,
      feedback,
    };
  }

  /**
   * Validate glucose value based on unit
   */
  validateGlucoseValue(value: number, unit: 'mg/dL' | 'mmol/L'): {
    isValid: boolean;
    message?: string;
    severity?: 'low' | 'normal' | 'high' | 'critical';
  } {
    if (unit === 'mg/dL') {
      if (value < 20 || value > 600) {
        return {
          isValid: false,
          message: 'Glucose value must be between 20 and 600 mg/dL',
        };
      }

      // Determine severity
      let severity: 'low' | 'normal' | 'high' | 'critical';
      if (value < 70) {
        severity = value < 54 ? 'critical' : 'low';
      } else if (value <= 140) {
        severity = 'normal';
      } else {
        severity = value > 250 ? 'critical' : 'high';
      }

      return { isValid: true, severity };
    } else {
      // mmol/L
      if (value < 1.1 || value > 33.3) {
        return {
          isValid: false,
          message: 'Glucose value must be between 1.1 and 33.3 mmol/L',
        };
      }

      // Determine severity
      let severity: 'low' | 'normal' | 'high' | 'critical';
      if (value < 3.9) {
        severity = value < 3.0 ? 'critical' : 'low';
      } else if (value <= 7.8) {
        severity = 'normal';
      } else {
        severity = value > 13.9 ? 'critical' : 'high';
      }

      return { isValid: true, severity };
    }
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  /**
   * Validate date of birth
   */
  validateDateOfBirth(dateString: string): {
    isValid: boolean;
    age?: number;
    message?: string;
  } {
    const date = new Date(dateString);
    const today = new Date();
    
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        message: 'Invalid date format',
      };
    }

    if (date > today) {
      return {
        isValid: false,
        message: 'Date of birth cannot be in the future',
      };
    }

    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      // Adjust age if birthday hasn't occurred this year
    }

    if (age < 13) {
      return {
        isValid: false,
        message: 'You must be at least 13 years old',
      };
    }

    if (age > 120) {
      return {
        isValid: false,
        message: 'Please enter a valid date of birth',
      };
    }

    return {
      isValid: true,
      age,
    };
  }

  /**
   * Validate phone number (basic validation)
   */
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Convert glucose units
   */
  convertGlucoseUnits(value: number, fromUnit: 'mg/dL' | 'mmol/L', toUnit: 'mg/dL' | 'mmol/L'): number {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
      return Math.round((value / 18.0182) * 10) / 10;
    } else if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
      return Math.round(value * 18.0182);
    }
    
    return value;
  }

  /**
   * Validate time format (HH:MM)
   */
  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Check if a string contains only alphanumeric characters and spaces
   */
  isAlphanumericWithSpaces(str: string): boolean {
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(str);
  }
}

// Export singleton instance
export const validationService = new ValidationService();
export default validationService;
