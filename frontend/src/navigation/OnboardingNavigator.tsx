import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Onboarding Screens
import OnboardingPersonalInfoScreen from '../screens/onboarding/OnboardingPersonalInfoScreen';
import OnboardingPersonalInfo2Screen from '../screens/onboarding/OnboardingPersonalInfo2Screen';
import OnboardingPersonalInfo3Screen from '../screens/onboarding/OnboardingPersonalInfo3Screen';
// TODO: Add these screens when created
// import OnboardingMedicalInfoScreen from '../screens/onboarding/OnboardingMedicalInfoScreen';
// import OnboardingPreferencesScreen from '../screens/onboarding/OnboardingPreferencesScreen';

/**
 * OnboardingNavigator - Multi-step onboarding flow for new users
 * 
 * Screens included:
 * - OnboardingPersonalInfo: Basic user information
 * - OnboardingMedicalInfo: Diabetes-related medical data
 * - OnboardingPreferences: App preferences and settings
 * 
 * Features:
 * - Step-by-step progression
 * - Progress indicators
 * - Data persistence between steps
 * - Prevents going back to auth screens
 */

const OnboardingStack = createNativeStackNavigator<RootStackParamList>();

export default function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      initialRouteName="OnboardingPersonalInfo1"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <OnboardingStack.Screen
        name="OnboardingPersonalInfo1"
        component={OnboardingPersonalInfoScreen}
        options={{
          gestureEnabled: false, // Prevent going back to auth
        }}
      />
      <OnboardingStack.Screen
        name="OnboardingPersonalInfo2"
        component={OnboardingPersonalInfo2Screen}
      />
      <OnboardingStack.Screen
        name="OnboardingPersonalInfo3"
        component={OnboardingPersonalInfo3Screen}
      />
    </OnboardingStack.Navigator>
  );
}
