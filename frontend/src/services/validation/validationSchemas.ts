import { z } from 'zod';

/**
 * Validation Schemas for GlucoVision
 * Comprehensive validation using Zod for type safety and runtime validation
 */

// Authentication Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, 'You must be between 13 and 120 years old'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Glucose Reading Schemas
export const glucoseReadingSchema = z.object({
  value: z
    .number()
    .min(20, 'Glucose value must be at least 20 mg/dL')
    .max(600, 'Glucose value must be less than 600 mg/dL'),
  unit: z.enum(['mg/dL', 'mmol/L']),
  timestamp: z.string().min(1, 'Timestamp is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  mealContext: z.enum(['before_meal', 'after_meal', 'fasting', 'bedtime']).optional(),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  dateOfBirth: z
    .string()
    .refine((date) => {
      if (!date) return true; // Optional field
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, 'You must be between 13 and 120 years old')
    .optional(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

// Health Metrics Schema
export const healthMetricsSchema = z.object({
  weight: z
    .number()
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight must be less than 300 kg')
    .optional(),
  bloodPressure: z.object({
    systolic: z
      .number()
      .min(70, 'Systolic pressure must be at least 70 mmHg')
      .max(250, 'Systolic pressure must be less than 250 mmHg'),
    diastolic: z
      .number()
      .min(40, 'Diastolic pressure must be at least 40 mmHg')
      .max(150, 'Diastolic pressure must be less than 150 mmHg'),
  }).optional(),
  heartRate: z
    .number()
    .min(30, 'Heart rate must be at least 30 bpm')
    .max(220, 'Heart rate must be less than 220 bpm')
    .optional(),
  steps: z
    .number()
    .min(0, 'Steps cannot be negative')
    .max(100000, 'Steps must be less than 100,000')
    .optional(),
  timestamp: z.string().min(1, 'Timestamp is required'),
});

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  enabled: z.boolean(),
  glucoseReminders: z.boolean(),
  medicationReminders: z.boolean(),
  criticalAlerts: z.boolean(),
  reminderTimes: z.array(z.object({
    hour: z.number().min(0).max(23),
    minute: z.number().min(0).max(59),
  })).optional(),
});

// Export type definitions
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type GlucoseReadingFormData = z.infer<typeof glucoseReadingSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type HealthMetricsFormData = z.infer<typeof healthMetricsSchema>;
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
