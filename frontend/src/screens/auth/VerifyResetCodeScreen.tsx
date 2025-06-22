import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink, FormError, ResendCodeSection } from '../../components/ui';
import SafeComponent from '../../components/SafeComponent';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useFormSubmission, useFormValidation, useResendCode, useAPI, API_ENDPOINTS } from '../../hooks';

/**
 * VerifyResetCodeScreen 
 */

type VerifyResetCodeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyResetCode'>;
type VerifyResetCodeScreenRouteProp = RouteProp<RootStackParamList, 'VerifyResetCode'>;

interface VerifyResetCodeScreenProps {
  navigation: VerifyResetCodeScreenNavigationProp;
  route: VerifyResetCodeScreenRouteProp;
}

function VerifyResetCodeScreen({ navigation, route }: VerifyResetCodeScreenProps) {
  // Safety check for route params
  const email = route?.params?.email;

  // If no email, navigate back
  useEffect(() => {
    if (!email) {
      Alert.alert(
        'Error',
        'Missing email information. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [email, navigation]);

  // State and hooks
  const [verificationData, setVerificationData] = useState<any>(null);
  const { request } = useAPI();

  // Auto-expire code after 15 minutes (900 seconds) - Disabled to prevent navigation conflicts
  // The backend will handle code expiration, and we'll show appropriate errors when codes are expired
  useEffect(() => {
    // Simple state update without timers to avoid navigation conflicts
    const checkExpiration = () => {
      // This will be handled by the backend validation
      // No client-side timer to avoid React Navigation conflicts
    };

    checkExpiration();
  }, []);

  // Early return if no email
  if (!email) {
    return null;
  }

  // Form validation
  const { values, errors, isValid, setValue, validateAll, resetForm } = useFormValidation({
    rules: {
      verificationCode: { required: true, minLength: 6, maxLength: 6, pattern: /^\d{6}$/ }
    },
    initialValues: { verificationCode: '' }
  });

  // Resend code functionality
  const { canResend, resendTimer, handleResendCode } = useResendCode({ email, resetForm });
  // Form submission with enhanced error handling
  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async () => {
      if (!validateAll()) {
        throw new Error('Please enter a valid 6-digit verification code');
      }



      try {
        const result = await request({
          endpoint: API_ENDPOINTS.AUTH.VERIFY_RESET_CODE,
          method: 'POST',
          data: {
            email,
            verification_code: values.verificationCode
          },
          showErrorAlert: false
        });

        console.log('Raw verification result:', JSON.stringify(result, null, 2));

        // Handle specific error cases
        if (!result || !result.success) {
          let errorMessage = 'Invalid verification code';

          // Better error message extraction
          if (result?.error) {
            if (typeof result.error === 'string') {
              errorMessage = result.error;
            } else if (typeof result.error === 'object') {
              // Handle object errors
              errorMessage = result.error.message || result.error.detail || JSON.stringify(result.error);
            }
          }

          console.log('Extracted error message:', errorMessage);

          // Check for specific error types
          if (errorMessage.toLowerCase().includes('expired')) {
            throw new Error('Verification code has expired. Please request a new code.');
          } else if (errorMessage.toLowerCase().includes('invalid')) {
            throw new Error('Invalid verification code. Please check and try again.');
          } else if (errorMessage.toLowerCase().includes('used')) {
            throw new Error('This verification code has already been used. Please request a new code.');
          } else {
            throw new Error(errorMessage);
          }
        }

        // Extract token from the result data
        const resultData = result.data || {};
        const token = resultData.token || resultData.reset_token;

        console.log('Extracted token:', token);
        console.log('Email for navigation:', email);

        // Validate required data for navigation
        if (!token) {
          throw new Error('Verification successful but missing reset token. Please try again.');
        }

        if (!email) {
          throw new Error('Missing email information. Please start the process again.');
        }

        setVerificationData(resultData);

        // Navigate with simple approach to avoid conflicts
        try {
          navigation.navigate('ResetPassword', {
            token,
            email
          });
        } catch (navError) {
          console.error('Navigation error:', navError);
          throw new Error('Navigation failed. Please try again.');
        }

      } catch (apiError: any) {
        console.error('API error:', apiError);

        // Re-throw with user-friendly message
        if (apiError.message) {
          throw apiError;
        } else {
          throw new Error('Unable to verify code. Please check your connection and try again.');
        }
      }
    },
    onSuccess: () => {
      // Navigation is handled in onSubmit to ensure we have the data
    },
    onError: (errorMessage: string) => {
      console.log('Verification error:', errorMessage);

      // Custom error handling for different scenarios
      if (errorMessage.toLowerCase().includes('expired')) {
        Alert.alert(
          'Code Expired',
          'Your verification code has expired. Would you like to request a new one?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Get New Code',
              onPress: async () => {
                resetForm();
                await handleResendCode();
              }
            }
          ]
        );
      } else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('wrong')) {
        Alert.alert(
          'Invalid Code',
          'The verification code you entered is incorrect. Please check and try again, or request a new code.',
          [
            { text: 'Try Again', style: 'default' },
            {
              text: 'Get New Code',
              onPress: async () => {
                resetForm();
                await handleResendCode();
              }
            }
          ]
        );
      } else if (errorMessage.toLowerCase().includes('used')) {
        Alert.alert(
          'Code Already Used',
          'This verification code has already been used. Please request a new one.',
          [
            {
              text: 'Get New Code',
              onPress: async () => {
                resetForm();
                await handleResendCode();
              }
            }
          ]
        );
      } else {
        // Default error handling with resend option
        Alert.alert(
          'Verification Failed',
          errorMessage,
          [
            { text: 'Try Again', style: 'default' },
            {
              text: 'Get New Code',
              onPress: async () => {
                resetForm();
                await handleResendCode();
              }
            }
          ]
        );
      }
    },
    successMessage: 'Code verified successfully!',
    showSuccessAlert: false
  });

  // Handle code input formatting
  const handleCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setValue('verificationCode', numericText);
  };

  return (
    <SafeComponent componentName="VerifyResetCodeScreen">
      <ScreenContainer>
        <FormContainer>
          <ScreenHeader
            title="Verify Code"
            subtitle={`Enter the 6-digit code sent to ${email}`}
          />

          <View className="mb-6">
            {/* Error Display */}
            <FormError error={error} />

            {/* Verification Code Input */}
            <FormInput
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={values.verificationCode}
              onChangeText={handleCodeChange}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.verificationCode}
              containerClassName="mb-6"
              inputClassName="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary text-center text-lg tracking-widest"
            />

            {/* Verify Button */}
            <Button
              title={isLoading ? "Verifying..." : "Verify Code"}
              onPress={() => handleSubmit({})}
              variant="primary"
              size="large"
              disabled={isLoading || !isValid}
              style={{ width: '100%', marginBottom: 16 }}
            />

            {/* Resend Code Section */}
            <ResendCodeSection
              canResend={canResend}
              resendTimer={resendTimer}
              onResend={handleResendCode}
              isLoading={isLoading}
            />

            {/* Help Text */}
            <View className="bg-lightBlue p-4 rounded-xl mb-6">
              <Text className="text-darkBlue text-sm text-center">
                📧 Check your email inbox and spam folder.{'\n'}
                ⏰ Code expires in 15 minutes from when it was sent.
              </Text>
            </View>
          </View>

          {/* Navigation back */}
          <NavigationLink
            questionText="Wrong email address?"
            actionText="Go Back"
            onPress={() => navigation.goBack()}
          />
        </FormContainer>
      </ScreenContainer>
    </SafeComponent>
  );
}

// Add displayName for debugging
VerifyResetCodeScreen.displayName = 'VerifyResetCodeScreen';

export default VerifyResetCodeScreen;
