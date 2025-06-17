import React from 'react';
import { ScrollView, Alert, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { ScreenContainer, NavigationHeader, DataSection, Button } from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';

/**
 * AccountScreen - User account management and profile settings
 */

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>;

interface AccountScreenProps {
  navigation: AccountScreenNavigationProp;
}

export default function AccountScreen({ navigation }: AccountScreenProps) {
  const { auth } = useAppState();
  const { request } = useAPI();

  // Fetch user profile data using clean useAPI hook
  const { data: profileData, isLoading, error, refetch } = useDataFetching({
    fetchFunction: async () => {
      if (!auth?.state?.token) {
        throw new Error('Authentication required');
      }

      const result = await request({
        endpoint: API_ENDPOINTS.USER.PROFILE,
        method: 'GET',
        token: auth.state.token,
        showErrorAlert: false
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch profile');
      }

      return result.data;
    },
    dependencies: [auth?.state?.token],
    onError: (error) => console.error('Failed to load profile:', error)
  });



  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (auth?.actions?.logout) {
                await auth.actions.logout();
              }
              // Navigation will be handled automatically by RootNavigator
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Action handlers
  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Your account will be deactivated and your data preserved for medical compliance.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call delete account API
              const response = await apiCall(API_ENDPOINTS.USER.DELETE_ACCOUNT, {
                method: 'DELETE'
              });

              if (response.success) {
                // Show success message and logout
                Alert.alert(
                  'Account Deleted',
                  'Your account has been successfully deleted. You will now be logged out.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Clear auth state and navigate to login
                        auth.actions.logout();
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Login' }]
                        });
                      }
                    }
                  ]
                );
              } else {
                throw new Error(response.error || 'Failed to delete account');
              }
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again later.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleExportData = () => {
    Alert.alert('Feature Coming Soon', 'Data export will be available in a future update.');
  };

  // Get user's full name
  const getFullName = () => {
    const userData = profileData?.data || auth?.state?.user;
    return `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User';
  };

  // Get account creation date
  const getJoinDate = () => {
    const userData = profileData?.data || auth?.state?.user;
    if (!userData?.createdAt) return 'Unknown';
    const date = new Date(userData.createdAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return 'Not set';

    try {
      const date = new Date(dateOfBirth);

      // Check if the date is valid and not a default/placeholder date
      if (isNaN(date.getTime()) || date.getFullYear() < 1920 || date.getFullYear() > new Date().getFullYear()) {
        return 'Not set';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date of birth:', error);
      return 'Not set';
    }
  };

  const userData = profileData?.data || auth?.state?.user || {};

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <NavigationHeader
        title="Account"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Section */}
        <DataSection
          title="Profile"
          subtitle={`Member since ${getJoinDate()}`}
          isLoading={isLoading}
          error={error}
          isEmpty={!userData}
          onRetry={refetch}
          className="mx-4 mt-4"
        >
          <View className="items-center p-4">
            <View className="w-20 h-20 bg-lightBlue rounded-full items-center justify-center mb-4">
              <Text className="text-2xl font-bold text-darkBlue">
                {userData?.firstName?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text className="text-xl font-bold text-darkBlue mb-1">
              {getFullName()}
            </Text>
            <Text className="text-textSecondary mb-2">
              {userData?.email || 'No email'}
            </Text>
          </View>
        </DataSection>

        {/* Personal Information */}
        <DataSection
          title="Personal Information"
          subtitle="Your basic information"
          isLoading={isLoading}
          error={error}
          isEmpty={!userData}
          className="mx-4 mt-4"
        >
          <InfoRow label="Date of Birth" value={formatDateOfBirth(userData?.dateOfBirth || userData?.date_of_birth)} />
          <InfoRow label="Gender" value={userData?.gender || 'Not set'} />
          <InfoRow label="Diabetes Type" value={userData?.diabetesType || 'Not set'} />
        </DataSection>

        {/* Account Actions */}
        <DataSection
          title="Account Management"
          subtitle="Manage your account settings"
          isLoading={false}
          error={null}
          isEmpty={false}
          className="mx-4 mt-4"
        >
          <View className="space-y-4">
            {/* Password Management */}
            <View className="mb-3">
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                variant="outline"
                size="large"
              />
            </View>

            {/* Data Export */}
            <View className="mb-3">
              <Button
                title="Export My Data"
                onPress={handleExportData}
                variant="outline"
                size="large"
              />
            </View>

            {/* Account Actions */}
            <View className="mt-2 space-y-3">
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="secondary"
                size="large"
              />
              <View className="mt-3">
                <Button
                  title="Delete Account"
                  onPress={handleDeleteAccount}
                  variant="secondary"
                  size="large"
                />
              </View>
            </View>
          </View>
        </DataSection>
      </ScrollView>
    </ScreenContainer>
  );
}

// Info Row Component
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2">
      <Text className="text-textSecondary font-medium">{label}</Text>
      <Text className="text-darkBlue font-medium">{value}</Text>
    </View>
  );
}
