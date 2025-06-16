import { useState, useCallback } from 'react';

/**
  
 * Provides consistent validation patterns and error management
 */

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  message?: string;
  type?: 'email' | 'password' | 'phone' | 'glucose' | 'age' | 'weight' | 'height';
}

// Pre-built validation patterns (from validationService.ts)
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  glucose: /^\d{1,3}(\.\d{1,2})?$/,
  age: /^(?:[1-9]|[1-9]\d|1[01]\d|120)$/,
  weight: /^\d{1,3}(\.\d{1,2})?$/,
  height: /^\d{1,3}(\.\d{1,2})?$/
};

// Pre-built validation messages
const VALIDATION_MESSAGES = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  phone: 'Please enter a valid phone number',
  glucose: 'Please enter a valid glucose value (0-999)',
  age: 'Please enter a valid age (1-120)',
  weight: 'Please enter a valid weight',
  height: 'Please enter a valid height',
  required: 'This field is required',
  minLength: 'Must be at least {min} characters',
  maxLength: 'Must be no more than {max} characters'
};

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface UseFormValidationProps {
  rules: ValidationRules;
  initialValues?: { [key: string]: string };
}

interface UseFormValidationReturn {
  values: { [key: string]: string };
  errors: { [key: string]: string };
  isValid: boolean;
  setValue: (field: string, value: string) => void;
  setValues: (newValues: { [key: string]: string }) => void;
  validateField: (field: string) => boolean;
  validateAll: () => boolean;
  clearErrors: () => void;
  clearError: (field: string) => void;
  resetForm: () => void;
}

export function useFormValidation({
  rules,
  initialValues = {}
}: UseFormValidationProps): UseFormValidationReturn {
  
  const [values, setValuesState] = useState<{ [key: string]: string }>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Enhanced field validation with built-in patterns
  const validateField = useCallback((field: string): boolean => {
    const value = values[field] || '';
    const rule = rules[field];

    if (!rule) return true;

    let error: string | null = null;

    // Required validation
    if (rule.required && !value.trim()) {
      error = rule.message || VALIDATION_MESSAGES.required;
    }
    // Type-based validation (enhanced from validationService.ts)
    else if (rule.type && value.trim()) {
      const pattern = VALIDATION_PATTERNS[rule.type];
      if (pattern && !pattern.test(value)) {
        error = rule.message || VALIDATION_MESSAGES[rule.type];
      }
    }
    // Min length validation
    else if (rule.minLength && value.length < rule.minLength) {
      error = rule.message || VALIDATION_MESSAGES.minLength.replace('{min}', rule.minLength.toString());
    }
    // Max length validation
    else if (rule.maxLength && value.length > rule.maxLength) {
      error = rule.message || VALIDATION_MESSAGES.maxLength.replace('{max}', rule.maxLength.toString());
    }
    // Pattern validation (custom patterns)
    else if (rule.pattern && !rule.pattern.test(value)) {
      error = rule.message || `${field} format is invalid`;
    }
    // Custom validation
    else if (rule.custom) {
      error = rule.custom(value);
    }

    // Update errors state
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));

    return !error;
  }, [values, rules]);

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const fieldNames = Object.keys(rules);
    const validationResults = fieldNames.map(field => validateField(field));
    return validationResults.every(isValid => isValid);
  }, [rules, validateField]);

  // Set single field value
  const setValue = useCallback((field: string, value: string) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Set multiple values
  const setValues = useCallback((newValues: { [key: string]: string }) => {
    setValuesState(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Clear specific error
  const clearError = useCallback((field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
  }, [initialValues]);

  // Check if form is valid (no errors and all required fields filled)
  const isValid = Object.values(errors).every(error => !error) && 
                  Object.keys(rules).every(field => {
                    const rule = rules[field];
                    const value = values[field] || '';
                    return !rule.required || value.trim() !== '';
                  });

  return {
    values,
    errors,
    isValid,
    setValue,
    setValues,
    validateField,
    validateAll,
    clearErrors,
    clearError,
    resetForm
  };
}

// Pre-built validation rule sets
export const VALIDATION_RULES = {
  login: {
    email: { required: true, type: 'email' as const },
    password: { required: true, minLength: 6 }
  },
  signup: {
    email: { required: true, type: 'email' as const },
    password: { required: true, type: 'password' as const },
    confirmPassword: { required: true, minLength: 8 },
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 }
  },
  glucoseLog: {
    value: { required: true, type: 'glucose' as const },
    logType: { required: true },
    notes: { maxLength: 500 }
  },
  onboardingStep1: {
    gender: { required: true },
    diabetesType: { required: true },
    diagnosedYear: { required: true }
  },
  onboardingStep2: {
    mealsPerDay: { required: true },
    activityLevel: { required: true },
    sleepDuration: { required: true }
  },
  profile: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, type: 'email' as const },
    phone: { type: 'phone' as const },
    age: { type: 'age' as const },
    weight: { type: 'weight' as const },
    height: { type: 'height' as const }
  },
  resetPassword: {
    email: { required: true, type: 'email' as const }
  },
  changePassword: {
    currentPassword: { required: true, minLength: 6 },
    newPassword: { required: true, type: 'password' as const },
    confirmPassword: { required: true, minLength: 8 }
  }
};
