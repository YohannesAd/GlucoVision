import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import OnboardingPersonalInfoScreen from '../screens/onboarding/OnboardingPersonalInfoScreen';
import OnboardingPersonalInfo2Screen from '../screens/onboarding/OnboardingPersonalInfo2Screen';
import OnboardingPersonalInfo3Screen from '../screens/onboarding/OnboardingPersonalInfo3Screen';

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
          gestureEnabled: false,
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
