import React from 'react';
import { ScreenContainer, FormContainer, AuthForm } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

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

  // Handle successful password reset
  const handleResetPasswordSuccess = () => {
    // Navigate to success screen
    navigation.navigate('ResetPasswordSuccess', { email });
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Reset Password Form - All logic handled by AuthForm */}
        <AuthForm
          formType="changePassword"
          title="Reset Password"
          subtitle="Create a new secure password for your account"
          onSuccess={handleResetPasswordSuccess}
        />
      </FormContainer>
    </ScreenContainer>
  );
}
