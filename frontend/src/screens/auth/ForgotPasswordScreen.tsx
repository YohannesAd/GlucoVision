import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_CONFIG, ENDPOINTS } from '../../services/api/config';
import NetworkTest from '../../components/debug/NetworkTest';

/**
 * ForgotPasswordScreen - Step 1 of password reset flow
 *
 * Features:
 * - Email input for password reset
 * - Email validation
 * - Loading state during request
 * - Navigation to verification screen
 * - Professional error handling
 */

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle forgot password form submission
  const handleForgotPassword = async () => {
    // Basic validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call forgot password API
      const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send reset code');
      }

      setIsLoading(false);

      // Navigate to verification screen with email
      navigation.navigate('VerifyResetCode', { email });

      // Show success message
      Alert.alert(
        'Code Sent!',
        `A verification code has been sent to ${data.email || email}. Please check your inbox.`,
        [{ text: 'OK' }]
      );

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Failed to send reset code. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Navigate back to login
  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Screen Header */}
        <ScreenHeader
          title="Forgot Password"
          subtitle="Enter your email to receive a verification code"
        />

        {/* Forgot Password Form */}
        <View className="mb-6">
          {/* Email Input */}
          <FormInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-6"
          />

          {/* Send Code Button */}
          <Button
            title={isLoading ? "Sending Code..." : "Send Verification Code"}
            onPress={handleForgotPassword}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={{ width: '100%', marginBottom: 16 }}
          />

          {/* Help Text */}
          <View className="bg-lightBlue p-4 rounded-xl mb-6">
            <Text className="text-darkBlue text-sm text-center">
              💡 We'll send a 6-digit verification code to your email address. 
              The code will expire in 15 minutes for security.
            </Text>
          </View>
        </View>

        {/* Navigation back to Login */}
        <NavigationLink
          questionText="Remember your password?"
          actionText="Back to Login"
          onPress={handleBackToLogin}
        />

        {/* Debug Network Test - Remove in production */}
        <NetworkTest />
      </FormContainer>
    </ScreenContainer>
  );
}
