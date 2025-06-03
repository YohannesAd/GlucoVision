import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Import Screens
import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import OnboardingPersonalInfoScreen from '../screens/onboarding/OnboardingPersonalInfoScreen';
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
          name="OnboardingPersonalInfo"
          component={OnboardingPersonalInfoScreen}
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
