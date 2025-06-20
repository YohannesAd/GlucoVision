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

function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
  console.log('ResetPasswordScreen - route.params:', route.params);

  const params = route.params || {};
  const { token, email } = params;

  console.log('ResetPasswordScreen - extracted params:', { token, email });

  // Safety check for required params
  if (!token || !email) {
    console.error('ResetPasswordScreen - Missing required params:', { token, email, params });
    navigation.goBack();
    return null;
  }

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
          formType="resetPasswordConfirm"
          title="Reset Password"
          subtitle="Create a new secure password for your account"
          onSuccess={handleResetPasswordSuccess}
          initialValues={{ token }}
        />
      </FormContainer>
    </ScreenContainer>
  );
}

// Add displayName for debugging
ResetPasswordScreen.displayName = 'ResetPasswordScreen';

export default ResetPasswordScreen;
