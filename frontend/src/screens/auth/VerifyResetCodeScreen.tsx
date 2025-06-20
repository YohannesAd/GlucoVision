import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink, FormError, ResendCodeSection } from '../../components/ui';
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
  // Form submission
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

        if (!result || !result.success) {
          throw new Error(result?.error || 'Invalid verification code');
        }

        // Extract token from the result data
        const resultData = result.data || {};
        const token = resultData.token || resultData.reset_token || 'temp-token';

        console.log('Extracted token:', token);
        console.log('Email for navigation:', email);

        setVerificationData(resultData);

        // Navigate with proper error handling
        if (token && email) {
          navigation.navigate('ResetPassword', {
            token,
            email
          });
        } else {
          throw new Error('Missing token or email for navigation');
        }
      } catch (navError) {
        console.error('Navigation error:', navError);
        throw navError;
      }
    },
    onSuccess: () => {
      // Navigation is handled in onSubmit to ensure we have the data
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
              📧 Check your email inbox and spam folder. 
              The code expires in 15 minutes.
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
  );
}

// Add displayName for debugging
VerifyResetCodeScreen.displayName = 'VerifyResetCodeScreen';

export default VerifyResetCodeScreen;
