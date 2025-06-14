import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Auth Screens
import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyResetCodeScreen from '../screens/auth/VerifyResetCodeScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ResetPasswordSuccessScreen from '../screens/auth/ResetPasswordSuccessScreen';

/**
 * AuthNavigator - Navigation stack for unauthenticated users
 * 
 * Screens included:
 * - Landing: App introduction
 * - Login: User authentication
 * - SignUp: User registration
 * 
 * Features:
 * - No header shown for clean UI
 * - Gesture navigation enabled
 * - Landing screen prevents swipe back
 */

const AuthStack = createNativeStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen
        name="Landing"
        component={LandingScreen}
        options={{
          gestureEnabled: false, // Prevent swipe back on landing
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen
        name="VerifyResetCode"
        component={VerifyResetCodeScreen}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
      <AuthStack.Screen
        name="ResetPasswordSuccess"
        component={ResetPasswordSuccessScreen}
      />
    </AuthStack.Navigator>
  );
}
