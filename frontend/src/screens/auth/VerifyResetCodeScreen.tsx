import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { API_CONFIG } from '../../services/api/config';

/**
 * VerifyResetCodeScreen - Step 2 of password reset flow
 *
 * Features:
 * - 6-digit verification code input
 * - Code validation
 * - Resend code functionality
 * - Timer countdown for resend
 * - Navigation to reset password screen
 */

type VerifyResetCodeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyResetCode'>;
type VerifyResetCodeScreenRouteProp = RouteProp<RootStackParamList, 'VerifyResetCode'>;

interface VerifyResetCodeScreenProps {
  navigation: VerifyResetCodeScreenNavigationProp;
  route: VerifyResetCodeScreenRouteProp;
}

export default function VerifyResetCodeScreen({ navigation, route }: VerifyResetCodeScreenProps) {
  const { email } = route.params;

  // Form state
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle verification code submission
  const handleVerifyCode = async () => {
    // Basic validation
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      // Call verify code API
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/verify-reset-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid verification code');
      }

      setIsLoading(false);

      // Navigate to reset password screen with token
      navigation.navigate('ResetPassword', { 
        token: data.token,
        email 
      });

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Failed to verify code. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);

    try {
      // Call forgot password API again
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to resend code');
      }

      setIsLoading(false);
      setCanResend(false);
      setResendTimer(60);
      setVerificationCode('');

      Alert.alert('Code Sent!', 'A new verification code has been sent to your email.');

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Failed to resend code. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Navigate back to forgot password
  const handleBackToForgotPassword = () => {
    navigation.goBack();
  };

  // Format verification code input
  const handleCodeChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(numericText);
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Screen Header */}
        <ScreenHeader
          title="Verify Code"
          subtitle={`Enter the 6-digit code sent to ${email}`}
        />

        {/* Verification Form */}
        <View className="mb-6">
          {/* Verification Code Input */}
          <FormInput
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChangeText={handleCodeChange}
            keyboardType="numeric"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-6"
            inputClassName="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary text-center text-lg tracking-widest"
          />

          {/* Verify Button */}
          <Button
            title={isLoading ? "Verifying..." : "Verify Code"}
            onPress={handleVerifyCode}
            variant="primary"
            size="large"
            disabled={isLoading || verificationCode.length !== 6}
            style={{ width: '100%', marginBottom: 16 }}
          />

          {/* Resend Code Section */}
          <View className="items-center mb-6">
            {canResend ? (
              <Button
                title="Resend Code"
                onPress={handleResendCode}
                variant="outline"
                size="medium"
                disabled={isLoading}
              />
            ) : (
              <Text className="text-textSecondary text-sm">
                Resend code in {resendTimer} seconds
              </Text>
            )}
          </View>

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
          onPress={handleBackToForgotPassword}
        />
      </FormContainer>
    </ScreenContainer>
  );
}
