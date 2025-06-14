/**
 * Validation Utilities for GlucoVision
 * Provides client-side validation helpers
 */

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
  };
}

/**
 * Validate password strength according to backend requirements
 */
export const validatePassword = (password: string): PasswordValidation => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const errors: string[] = [];
  
  if (!requirements.minLength) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: Object.values(requirements).every(Boolean),
    errors,
    requirements,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get user-friendly error messages for common validation errors
 */
export const getValidationErrorMessage = (field: string, error: string): string => {
  const errorMap: Record<string, string> = {
    'email_required': 'Email is required',
    'email_invalid': 'Please enter a valid email address',
    'password_required': 'Password is required',
    'password_weak': 'Password must contain uppercase, lowercase, and numeric characters',
    'password_short': 'Password must be at least 8 characters long',
    'passwords_mismatch': 'Passwords do not match',
    'first_name_required': 'First name is required',
    'last_name_required': 'Last name is required',
  };

  return errorMap[error] || `${field} is invalid`;
};
