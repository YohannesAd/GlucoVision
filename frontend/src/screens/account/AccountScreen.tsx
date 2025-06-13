import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer } from '../../components/ui';

/**
 * AccountScreen - User account management and profile settings
 * 
 * Features:
 * - Profile information display and editing
 * - Medical information from onboarding
 * - App preferences and settings
 * - Account management (password, logout, delete)
 * - Data privacy and export options
 * - Professional medical app design
 * 
 * Sections:
 * 1. Profile Header with user info
 * 2. Personal Information
 * 3. Medical Information
 * 4. App Preferences
 * 5. Account Management
 * 6. Data & Privacy
 */

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Account'>;

interface AccountScreenProps {
  navigation: AccountScreenNavigationProp;
}

export default function AccountScreen({ navigation }: AccountScreenProps) {
  const { state, logout } = useAuth();
  const { user } = state;

  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState<string[]>(['profile']);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

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
              await logout();
              // Navigation will be handled automatically by RootNavigator
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          }
        }
      ]
    );
  };

  // Handle password change
  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    Alert.alert('Feature Coming Soon', 'Password change will be available in a future update.');
  };

  // Handle data export
  const handleExportData = () => {
    // TODO: Implement data export
    Alert.alert('Feature Coming Soon', 'Data export will be available in a future update.');
  };

  // Get user's full name
  const getFullName = () => {
    return `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  };

  // Get account creation date
  const getJoinDate = () => {
    if (!user?.createdAt) return 'Unknown';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Text className="text-darkBlue text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkBlue">Account</Text>
          <View className="w-12" />
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <View className="items-center">
            {/* Profile Picture Placeholder */}
            <View className="w-20 h-20 bg-lightBlue rounded-full items-center justify-center mb-4">
              <Text className="text-2xl font-bold text-darkBlue">
                {user?.firstName?.charAt(0) || 'U'}
              </Text>
            </View>
            
            {/* User Name */}
            <Text className="text-xl font-bold text-darkBlue mb-1">
              {getFullName()}
            </Text>
            
            {/* Email */}
            <Text className="text-textSecondary mb-2">
              {user?.email || 'No email'}
            </Text>
            
            {/* Join Date */}
            <Text className="text-sm text-textSecondary">
              Member since {getJoinDate()}
            </Text>
            
            {/* Email Verification Status */}
            {user?.isEmailVerified !== undefined && (
              <View className={`mt-3 px-3 py-1 rounded-full ${
                user.isEmailVerified ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  user.isEmailVerified ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {user.isEmailVerified ? '✓ Email Verified' : '⚠ Email Not Verified'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Personal Information Section */}
        <AccountSection
          title="Personal Information"
          icon="👤"
          isExpanded={expandedSections.includes('personal')}
          onToggle={() => toggleSection('personal')}
        >
          <InfoRow label="Date of Birth" value={user?.dateOfBirth || 'Not set'} />
          <InfoRow label="Gender" value={user?.gender || 'Not set'} />
          <InfoRow label="Diabetes Type" value={user?.diabetesType || 'Not set'} />
          <InfoRow label="Diagnosis Date" value={user?.diagnosisDate || 'Not set'} />
        </AccountSection>

        {/* Medical Information Section */}
        <AccountSection
          title="Medical Information"
          icon="🏥"
          isExpanded={expandedSections.includes('medical')}
          onToggle={() => toggleSection('medical')}
        >
          <InfoRow 
            label="Takes Insulin" 
            value={user?.medicalInfo?.takesInsulin ? 'Yes' : 'No'} 
          />
          {user?.medicalInfo?.takesInsulin && (
            <InfoRow 
              label="Insulin Type" 
              value={user?.medicalInfo?.insulinType || 'Not specified'} 
            />
          )}
          <InfoRow 
            label="Activity Level" 
            value={user?.medicalInfo?.activityLevel || 'Not set'} 
          />
          <InfoRow 
            label="Meals Per Day" 
            value={user?.medicalInfo?.mealsPerDay?.toString() || 'Not set'} 
          />
          <InfoRow 
            label="Sleep Duration" 
            value={user?.medicalInfo?.sleepDuration ? `${user.medicalInfo.sleepDuration} hours` : 'Not set'} 
          />
        </AccountSection>

        {/* App Preferences Section */}
        <AccountSection
          title="App Preferences"
          icon="⚙️"
          isExpanded={expandedSections.includes('preferences')}
          onToggle={() => toggleSection('preferences')}
        >
          <InfoRow 
            label="Glucose Unit" 
            value={user?.preferences?.glucoseUnit || 'mg/dL'} 
          />
          <InfoRow 
            label="Theme" 
            value={user?.preferences?.theme || 'System'} 
          />
          <InfoRow 
            label="Reminders" 
            value={user?.preferences?.notifications?.reminders ? 'Enabled' : 'Disabled'} 
          />
          <InfoRow 
            label="AI Insights" 
            value={user?.preferences?.notifications?.insights ? 'Enabled' : 'Disabled'} 
          />
        </AccountSection>

        {/* Account Management Section */}
        <AccountSection
          title="Account Management"
          icon="🔐"
          isExpanded={expandedSections.includes('account')}
          onToggle={() => toggleSection('account')}
        >
          <ActionButton 
            title="Change Password" 
            onPress={handleChangePassword}
            icon="🔑"
          />
          <ActionButton 
            title="Export My Data" 
            onPress={handleExportData}
            icon="📤"
          />
          <ActionButton 
            title="Logout" 
            onPress={handleLogout}
            icon="🚪"
            variant="secondary"
          />
          <ActionButton 
            title="Delete Account" 
            onPress={handleDeleteAccount}
            icon="🗑️"
            variant="danger"
          />
        </AccountSection>
      </ScrollView>
    </ScreenContainer>
  );
}

// Account Section Component
interface AccountSectionProps {
  title: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccountSection({ title, icon, isExpanded, onToggle, children }: AccountSectionProps) {
  return (
    <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between p-4 border-b border-gray-100"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <Text className="text-lg mr-3">{icon}</Text>
          <Text className="text-lg font-semibold text-darkBlue">{title}</Text>
        </View>
        <Text className="text-textSecondary text-lg">
          {isExpanded ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View className="p-4">
          {children}
        </View>
      )}
    </View>
  );
}

// Info Row Component
interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="flex-row justify-between items-center py-2">
      <Text className="text-textSecondary font-medium">{label}</Text>
      <Text className="text-darkBlue font-medium">{value}</Text>
    </View>
  );
}

// Action Button Component
interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

function ActionButton({ title, onPress, icon, variant = 'primary' }: ActionButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'secondary':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-lightBlue border-lightBlue';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-600';
      case 'secondary':
        return 'text-textSecondary';
      default:
        return 'text-darkBlue';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-3 rounded-lg border mb-2 ${getButtonStyle()}`}
      activeOpacity={0.7}
    >
      <Text className="text-lg mr-3">{icon}</Text>
      <Text className={`font-medium ${getTextStyle()}`}>{title}</Text>
    </TouchableOpacity>
  );
}
