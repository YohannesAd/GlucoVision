import React from 'react';
import { ScreenContainer, FormContainer, AuthForm, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * ForgotPasswordScreen 

 */

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  // Handle successful password reset request
  const handleForgotPasswordSuccess = (data: any) => {
    // Navigate to verification screen with email
    navigation.navigate('VerifyResetCode', { email: data.email });
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Forgot Password Form - All logic handled by AuthForm */}
        <AuthForm
          formType="resetPassword"
          title="Forgot Password"
          subtitle="Enter your email to receive a verification code"
          onSuccess={handleForgotPasswordSuccess}
          footerContent={
            <NavigationLink
              questionText="Remember your password?"
              actionText="Back to Login"
              onPress={() => navigation.navigate('Login')}
            />
          }
        />
      </FormContainer>
    </ScreenContainer>
  );
}

// Add displayName for debugging
ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';

export default ForgotPasswordScreen;
