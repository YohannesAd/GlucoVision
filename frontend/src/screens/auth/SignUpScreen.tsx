import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, NavigationLink } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

/**
 * SignUpScreen - User registration screen
 *
 * Features:
 * - Complete user registration form
 * - Form validation (required fields, password matching, password length)
 * - Loading state during registration
 * - Navigation to Login and Onboarding screens
 * - Consistent UI using shared components
 */

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  // Auth context
  const { signUp } = useAuth();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle sign up form submission
  const handleSignUp = async () => {
    // Form validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Use AuthContext to sign up the user
      await signUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      setIsLoading(false);
      // Navigation will be handled automatically by RootNavigator
      // based on the user's onboarding status
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Sign up failed. Please try again.');
    }
  };

  // Navigate to login screen
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Screen Header */}
        <ScreenHeader
          title="Create Account"
          subtitle="Join GlucoVision to start your health journey"
        />

        {/* Sign Up Form */}
        <View className="mb-6">
          {/* Name Inputs Row */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <FormInput
                label="First Name"
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                containerClassName="mb-0"
              />
            </View>

            <View className="flex-1 ml-2">
              <FormInput
                label="Last Name"
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                containerClassName="mb-0"
              />
            </View>
          </View>

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Confirm Password Input */}
          <FormInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-6"
          />

          {/* Sign Up Button */}
          <Button
            title={isLoading ? "Creating Account..." : "Create Account"}
            onPress={handleSignUp}
            variant="primary"
            size="large"
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </View>

        {/* Navigation to Login */}
        <NavigationLink
          questionText="Already have an account?"
          actionText="Sign In"
          onPress={handleLogin}
        />
      </FormContainer>
    </ScreenContainer>
  );
}
