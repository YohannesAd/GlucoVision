import React from 'react';
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
  const { email } = route.params;

  // Navigate to login screen
  const handleGoToLogin = () => {
    // Reset navigation stack to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

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
            <Text className="text-primary font-medium">{email}</Text>
          </View>

          {/* Security Notice */}
          <View className="bg-lightBlue p-4 rounded-xl mb-6">
            <Text className="text-darkBlue font-medium mb-2">🔐 Security Notice</Text>
            <Text className="text-darkBlue text-sm leading-5">
              • Your password has been securely updated{'\n'}
              • All active sessions have been logged out{'\n'}
              • Use your new password to sign in{'\n'}
              • Keep your password safe and secure
            </Text>
          </View>

          {/* Next Steps */}
          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-textPrimary font-medium mb-2">What's Next?</Text>
            <Text className="text-textSecondary text-sm leading-5">
              1. Sign in with your new password{'\n'}
              2. Continue managing your health data{'\n'}
              3. Consider enabling two-factor authentication{'\n'}
              4. Update your password manager if you use one
            </Text>
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
}
