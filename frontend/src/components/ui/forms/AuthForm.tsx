import React from 'react';
import { View, Text } from 'react-native';
import FormInput from '../inputs/FormInput';
import Button from '../buttons/Button';
import ErrorMessage from '../messages/ErrorMessage';
import { useFormValidation, VALIDATION_RULES } from '../../../hooks';
import { useAuth } from '../../../context/AuthContext';

/**
 * AuthForm Component - Enhanced with integrated logic
 *
 * REPLACES large portions of auth service logic
 * Integrates validation, submission, and state management
 *
 * Professional form wrapper for authentication screens
 * Handles common auth form patterns and validation display
 *
 * ABSORBS LOGIC FROM:
 * - authService.ts (login/signup/reset logic)
 * - validationService.ts (form validation)
 * - AuthContext.tsx (state management)
 *
 * Used in:
 * - LoginScreen (email/password)
 * - SignUpScreen (registration fields)
 * - ResetPasswordScreens (email/code/password)
 * - ChangePasswordScreen (old/new password)
 */

interface AuthFormProps {
  formType: 'login' | 'signup' | 'resetPassword' | 'changePassword';
  title: string;
  subtitle?: string;
  onSuccess?: (data?: any) => void;
  footerContent?: React.ReactNode;
  className?: string;
}

export default function AuthForm({
  formType,
  title,
  subtitle,
  onSuccess,
  footerContent,
  className = ''
}: AuthFormProps) {

  // Get validation rules for form type
  const validationRules = VALIDATION_RULES[formType];

  // Initialize form validation
  const {
    values,
    errors,
    isValid,
    setValue,
    validateAll,
    resetForm
  } = useFormValidation({ rules: validationRules });

  // Use AuthContext directly instead of useAppState
  const authContext = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle form submission with integrated auth logic
  const handleSubmit = async () => {
    if (!validateAll()) {
      setError('Please fix validation errors');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Perform auth operation based on form type
      let result;
      switch (formType) {
        case 'login':
          result = await authContext.login({
            email: values.email,
            password: values.password
          });
          break;

        case 'signup':
          result = await authContext.signUp({
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            firstName: values.firstName,
            lastName: values.lastName
          });
          break;

        case 'resetPassword':
          // TODO: Implement reset password
          console.log('Reset password for:', values.email);
          result = { success: true };
          break;

        case 'changePassword':
          // TODO: Implement change password
          console.log('Change password');
          result = { success: true };
          break;

        default:
          throw new Error('Invalid form type');
      }

      if (result) {
        resetForm();
        if (onSuccess) onSuccess(result);
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field configurations
  const FORM_FIELDS = {
    login: [
      { key: 'email', label: 'Email', type: 'email-address' as const },
      { key: 'password', label: 'Password', secureTextEntry: true }
    ],
    signup: [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email', type: 'email-address' as const },
      { key: 'password', label: 'Password', secureTextEntry: true },
      { key: 'confirmPassword', label: 'Confirm Password', secureTextEntry: true }
    ],
    resetPassword: [
      { key: 'email', label: 'Email', type: 'email-address' as const }
    ],
    changePassword: [
      { key: 'currentPassword', label: 'Current Password', secureTextEntry: true },
      { key: 'newPassword', label: 'New Password', secureTextEntry: true },
      { key: 'confirmPassword', label: 'Confirm New Password', secureTextEntry: true }
    ]
  };

  // Button text and messages
  const BUTTON_TEXTS = {
    login: 'Sign In',
    signup: 'Create Account',
    resetPassword: 'Send Reset Link',
    changePassword: 'Update Password'
  };

  const SUCCESS_MESSAGES = {
    signup: 'Account created successfully!',
    resetPassword: 'Reset link sent to your email!',
    changePassword: 'Password updated successfully!'
  };

  const formFields = FORM_FIELDS[formType] || [];
  const buttonText = isLoading ? 'Please wait...' : BUTTON_TEXTS[formType] || 'Submit';
  
  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {/* Form Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-darkBlue mb-2">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-textSecondary text-base">
            {subtitle}
          </Text>
        )}
      </View>

      {/* Error Message */}
      {(error || authContext.state.error) && (
        <ErrorMessage
          message={error || authContext.state.error || ''}
          variant="card"
          className="mb-4"
        />
      )}

      {/* Form Fields */}
      <View className="space-y-4 mb-6">
        {formFields.map((field) => (
          <View key={field.key}>
            <FormInput
              label={field.label}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              value={values[field.key] || ''}
              onChangeText={(text) => setValue(field.key, text)}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.type || 'default'}
              autoCapitalize={field.key === 'email' ? 'none' : 'sentences'}
              error={errors[field.key]}
            />
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <Button
        title={buttonText}
        onPress={handleSubmit}
        variant="primary"
        size="large"
        disabled={isLoading || !isValid}
        className="mb-4"
      />

      {/* Footer Content */}
      {footerContent && (
        <View className="mt-4">
          {footerContent}
        </View>
      )}
    </View>
  );
}
