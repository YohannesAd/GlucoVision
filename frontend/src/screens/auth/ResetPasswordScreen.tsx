import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { API_CONFIG } from '../../services/api/config';

/**
 * ResetPasswordScreen - Step 3 of password reset flow
 *
 * Features:
 * - New password input with confirmation
 * - Password strength validation
 * - Password visibility toggle
 * - Secure password reset
 * - Navigation to success screen
 */

type ResetPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

interface ResetPasswordScreenProps {
  navigation: ResetPasswordScreenNavigationProp;
  route: ResetPasswordScreenRouteProp;
}

export default function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
  const { token, email } = route.params;

  // Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle password reset submission
  const handleResetPassword = async () => {
    // Form validation
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Call reset password API
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setIsLoading(false);

      // Navigate to success screen
      navigation.navigate('ResetPasswordSuccess', { email });

    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Failed to reset password. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 'none', color: 'gray', text: '' };
    if (password.length < 6) return { strength: 'weak', color: 'red', text: 'Weak' };
    if (password.length < 8) return { strength: 'fair', color: 'orange', text: 'Fair' };
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score >= 3 && password.length >= 8) return { strength: 'strong', color: 'green', text: 'Strong' };
    return { strength: 'good', color: 'blue', text: 'Good' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Screen Header */}
        <ScreenHeader
          title="Reset Password"
          subtitle="Create a new secure password for your account"
        />

        {/* Reset Password Form */}
        <View className="mb-6">
          {/* New Password Input */}
          <FormInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Strength Indicator */}
          {newPassword.length > 0 && (
            <View className="mb-4">
              <Text className={`text-sm font-medium text-${passwordStrength.color === 'red' ? 'error' : passwordStrength.color === 'green' ? 'success' : 'textSecondary'}`}>
                Password Strength: {passwordStrength.text}
              </Text>
            </View>
          )}

          {/* Confirm Password Input */}
          <FormInput
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-6"
          />

          {/* Reset Password Button */}
          <Button
            title={isLoading ? "Resetting Password..." : "Reset Password"}
            onPress={handleResetPassword}
            variant="primary"
            size="large"
            disabled={isLoading || !newPassword || !confirmPassword}
            style={{ width: '100%', marginBottom: 16 }}
          />

          {/* Password Requirements */}
          <View className="bg-lightBlue p-4 rounded-xl">
            <Text className="text-darkBlue font-medium mb-2">Password Requirements:</Text>
            <Text className="text-darkBlue text-sm leading-5">
              • At least 8 characters long{'\n'}
              • Mix of uppercase and lowercase letters{'\n'}
              • Include numbers and special characters{'\n'}
              • Avoid common passwords
            </Text>
          </View>
        </View>
      </FormContainer>
    </ScreenContainer>
  );
}
