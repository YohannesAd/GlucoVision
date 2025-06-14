import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginScreen - User authentication screen
 *
 * Features:
 * - Email and password input validation
 * - Loading state during authentication
 * - Navigation to SignUp and Dashboard
 * - Forgot password functionality (placeholder)
 * - Consistent UI using shared components
 */

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  // Auth context
  const { login, clearError, state } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear any previous errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, []);

  useEffect(() => {
    if (email || password) {
      clearError();
      setLocalError(null);
    }
  }, [email, password]);

  // Handle login form submission
  const handleLogin = async () => {
    // Prevent multiple simultaneous login attempts
    if (isLoading) {
      return;
    }

    // Clear any previous errors
    clearError();
    setLocalError(null);

    // Basic validation
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Use AuthContext to login the user
      await login({ email, password });
      setIsLoading(false);
      // Navigation will be handled automatically by RootNavigator
      // based on the user's authentication and onboarding status
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.message || 'Login failed. Please try again.';
      setLocalError(errorMessage);
    }
  };

  // Navigate to sign up screen
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Screen Header */}
        <ScreenHeader
          title="Welcome Back"
          subtitle="Sign in to continue managing your health"
        />

        {/* Login Form */}
        <View className="mb-6">
          {/* Email Input */}
          <FormInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Input */}
          <FormInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showPasswordToggle
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-4"
          />

          {/* Error Message */}
          {localError && (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-600 text-sm font-medium text-center">
                {localError}
              </Text>
            </View>
          )}

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={handleForgotPassword} className="mb-6">
            <Text className="text-primary font-medium text-right">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            title={isLoading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </View>

        {/* Navigation to Sign Up */}
        <NavigationLink
          questionText="Don't have an account?"
          actionText="Sign Up"
          onPress={handleSignUp}
        />
      </FormContainer>
    </ScreenContainer>
  );
}
