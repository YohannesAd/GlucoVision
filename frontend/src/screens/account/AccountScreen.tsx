import React from 'react';
import { ScrollView, Alert, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { ScreenContainer, ScreenHeader, DataSection, Button } from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';

/**
 * AccountScreen - User account management and profile settings
 */

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>;

interface AccountScreenProps {
  navigation: AccountScreenNavigationProp;
}

export default function AccountScreen({ }: AccountScreenProps) {
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
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.')
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Feature Coming Soon', 'Password change will be available in a future update.');
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

  const userData = profileData?.data || auth?.state?.user || {};

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <ScreenHeader
        title="Account"
        subtitle="Manage your profile and settings"
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
          <InfoRow label="Date of Birth" value={userData?.dateOfBirth || 'Not set'} />
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
          <View className="space-y-3">
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              variant="outline"
              size="large"
            />
            <Button
              title="Export My Data"
              onPress={handleExportData}
              variant="outline"
              size="large"
            />
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="secondary"
              size="large"
            />
            <Button
              title="Delete Account"
              onPress={handleDeleteAccount}
              variant="secondary"
              size="large"
            />
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
