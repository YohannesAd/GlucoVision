import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, Button } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

/**
 * ResetPasswordSuccessScreen 
 */

type ResetPasswordSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPasswordSuccess'>;
type ResetPasswordSuccessScreenRouteProp = RouteProp<RootStackParamList, 'ResetPasswordSuccess'>;

interface ResetPasswordSuccessScreenProps {
  navigation: ResetPasswordSuccessScreenNavigationProp;
  route: ResetPasswordSuccessScreenRouteProp;
}

export default function ResetPasswordSuccessScreen({ navigation, route }: ResetPasswordSuccessScreenProps) {
  console.log('ResetPasswordSuccessScreen - Mounted');
  console.log('ResetPasswordSuccessScreen - route.params:', route.params);

  const params = route.params || {};
  const { email } = params;

  // Safety check for email
  if (!email) {
    console.error('ResetPasswordSuccessScreen - Missing email param');
  }

  // Add useEffect to monitor component lifecycle
  useEffect(() => {
    console.log('ResetPasswordSuccessScreen - useEffect mounted');

    return () => {
      console.log('ResetPasswordSuccessScreen - useEffect cleanup');
    };
  }, []);

  // Navigate to login screen with error handling
  const handleGoToLogin = () => {
    try {
      console.log('ResetPasswordSuccessScreen - Navigating to Login');

      // Use a safer navigation approach
      setTimeout(() => {
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (resetError) {
          console.error('ResetPasswordSuccessScreen - Reset navigation error:', resetError);
          // Fallback to simple navigation
          navigation.navigate('Login');
        }
      }, 100);

    } catch (error) {
      console.error('ResetPasswordSuccessScreen - Navigation error:', error);
    }
  };

  // Render with error boundary
  try {
    return (
      <ScreenContainer>
        <FormContainer>
        {/* Success Icon and Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-success rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">✓</Text>
          </View>
          
          <ScreenHeader
            title="Password Reset Complete!"
            subtitle="Your password has been successfully updated"
          />
        </View>

        {/* Success Information */}
        <View className="mb-8">
          {/* Account Info */}
          <View className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <Text className="text-textPrimary font-semibold mb-2">Account Updated</Text>
            <Text className="text-textSecondary text-sm mb-4">
              Password successfully reset for:
            </Text>
            <Text className="text-primary font-medium">{email || 'your account'}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-6">
          <Button
            title="Sign In Now"
            onPress={handleGoToLogin}
            variant="primary"
            size="large"
            style={{ width: '100%', marginBottom: 16 }}
          />
          
          <Text className="text-center text-textSecondary text-sm">
            You can now sign in to GlucoVision with your new password
          </Text>
        </View>

        {/* Additional Help */}
        <View className="items-center">
          <Text className="text-textSecondary text-xs text-center">
            Having trouble signing in? Contact support for assistance.
          </Text>
        </View>
      </FormContainer>
    </ScreenContainer>
  );
  } catch (error) {
    console.error('ResetPasswordSuccessScreen - Render error:', error);
    return (
      <ScreenContainer>
        <FormContainer>
          <View className="items-center p-6">
            <Text className="text-red-500 text-center mb-4">
              Something went wrong. Please try again.
            </Text>
            <Button
              title="Go to Login"
              onPress={handleGoToLogin}
              variant="primary"
              size="medium"
            />
          </View>
        </FormContainer>
      </ScreenContainer>
    );
  }
}
