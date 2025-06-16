import React from 'react';
import { ScreenContainer, FormContainer, AuthForm, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * SignUpScreen 
 */

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  // Handle successful signup
  const handleSignUpSuccess = () => {
    // Navigation handled automatically by RootNavigator
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* SignUp Form - All logic handled by AuthForm */}
        <AuthForm
          formType="signup"
          title="Create Account"
          subtitle="Join GlucoVision to start your health journey"
          onSuccess={handleSignUpSuccess}
          footerContent={
            <NavigationLink
              questionText="Already have an account?"
              actionText="Sign In"
              onPress={() => navigation.navigate('Login')}
            />
          }
        />
      </FormContainer>
    </ScreenContainer>
  );
}
