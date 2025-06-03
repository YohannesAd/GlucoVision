import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    // Validation
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
      // TODO: Implement actual sign up logic here
      // For now, simulate sign up and navigate to onboarding
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('OnboardingPersonalInfo');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Sign up failed. Please try again.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-6 py-40">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-darkBlue mb-2">
              Create Account
            </Text>
            <Text className="text-textSecondary text-base text-center">
              Join GlucoVision to start your health journey
            </Text>
          </View>

          {/* Sign Up Form */}
          <View className="flex-1 justify-center">
            {/* Name Inputs */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-textPrimary font-medium mb-2 text-sm">First Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary"
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>

              <View className="flex-1 ml-2">
                <Text className="text-textPrimary font-medium mb-2 text-sm">Last Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary"
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-textPrimary font-medium mb-2 text-sm">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-textPrimary font-medium mb-2 text-sm">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className="text-textPrimary font-medium mb-2 text-sm">Confirm Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

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

          {/* Login Link */}
          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-textSecondary">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={handleLogin} className="ml-1">
              <Text className="text-primary font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
