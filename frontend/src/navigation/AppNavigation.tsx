import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OnboardingPersonalInfo1Screen from '../screens/onboarding/OnboardingPersonalInfoScreen';
import OnboardingPersonalInfo2Screen from '../screens/onboarding/OnboardingPersonalInfo2Screen';
import OnboardingPersonalInfo3Screen from '../screens/onboarding/OnboardingPersonalInfo3Screen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{
            gestureEnabled: false, // Disable swipe back on landing
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
        />
        <Stack.Screen
          name="OnboardingPersonalInfo1"
          component={OnboardingPersonalInfo1Screen}
          options={{
            gestureEnabled: false, // Disable swipe back to auth
          }}
        />
        <Stack.Screen
          name="OnboardingPersonalInfo2"
          component={OnboardingPersonalInfo2Screen}
        />
        <Stack.Screen
          name="OnboardingPersonalInfo3"
          component={OnboardingPersonalInfo3Screen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            gestureEnabled: false, // Disable swipe back on dashboard
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
