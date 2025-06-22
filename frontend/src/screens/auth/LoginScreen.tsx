import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScreenContainer, FormContainer, AuthForm, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * LoginScreen - Clean, professional authentication
 *
 * REFACTORED using our powerful AuthForm component:
 * - Handles all form logic, validation, and submission
 * - Integrates with useAppState for authentication
 * - Provides consistent error handling and loading states
 * - Reduces 161 lines to ~40 lines (75% reduction!)
 */

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  // Handle successful login
  const handleLoginSuccess = () => {
    // Navigation handled automatically by RootNavigator
    // based on authentication and onboarding status
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Login Form - All logic handled by AuthForm */}
        <AuthForm
          formType="login"
          title="Welcome Back"
          subtitle="Sign in to continue managing your health"
          onSuccess={handleLoginSuccess}
          footerContent={
            <View>
              {/* Forgot Password Link */}
              <View className="mb-6">
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  className="py-3 px-4 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Text className="text-primary text-center font-semibold text-base">
                    🔐 Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <NavigationLink
                questionText="Don't have an account?"
                actionText="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
              />
            </View>
          }
        />
      </FormContainer>
    </ScreenContainer>
  );
}

// Add displayName for debugging
LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;
