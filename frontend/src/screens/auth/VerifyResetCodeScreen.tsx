import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink, FormError, ResendCodeSection } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useFormSubmission, useFormValidation, useResendCode } from '../../hooks';

/**
 * VerifyResetCodeScreen 
 */

type VerifyResetCodeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyResetCode'>;
type VerifyResetCodeScreenRouteProp = RouteProp<RootStackParamList, 'VerifyResetCode'>;

interface VerifyResetCodeScreenProps {
  navigation: VerifyResetCodeScreenNavigationProp;
  route: VerifyResetCodeScreenRouteProp;
}

export default function VerifyResetCodeScreen({ navigation, route }: VerifyResetCodeScreenProps) {
  const { email } = route.params;

  // State and hooks
  const [verificationData, setVerificationData] = useState<any>(null);

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

      const response = await fetch('/api/v1/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          verification_code: values.verificationCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid verification code');
      }

      setVerificationData(data);
    },
    onSuccess: () => {
      navigation.navigate('ResetPassword', {
        token: verificationData?.token || 'temp-token',
        email
      });
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
