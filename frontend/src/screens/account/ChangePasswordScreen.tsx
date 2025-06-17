import React from 'react';
import { Alert } from 'react-native';
import { ScreenContainer, NavigationHeader, FormContainer, AuthForm } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * ChangePasswordScreen - User password change functionality
 *
 * Features:
 * - Current password verification
 * - New password input with confirmation
 * - Password strength validation
 * - Secure password update
 * - Navigation back to Account screen
 */

type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;

interface ChangePasswordScreenProps {
  navigation: ChangePasswordScreenNavigationProp;
}

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  // Handle successful password change
  const handlePasswordChangeSuccess = () => {
    // Show success message and navigate back
    Alert.alert(
      'Success',
      'Password changed successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <NavigationHeader
        title="Change Password"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <FormContainer>
        {/* Change Password Form - All logic handled by AuthForm */}
        <AuthForm
          formType="changePassword"
          title="Change Password"
          subtitle="Enter your current password and choose a new one"
          onSuccess={handlePasswordChangeSuccess}
        />
      </FormContainer>
    </ScreenContainer>
  );
}
