import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import SafeComponent from '../components/SafeComponent';
import NavigationErrorBoundary from '../components/NavigationErrorBoundary';

import LandingScreen from '../screens/Landing/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyResetCodeScreen from '../screens/auth/VerifyResetCodeScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ResetPasswordSuccessScreen from '../screens/auth/ResetPasswordSuccessScreen';

const AuthStack = createNativeStackNavigator<RootStackParamList>();

function AuthNavigator() {
  return (
    <NavigationErrorBoundary>
      <SafeComponent componentName="AuthNavigator">
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
              gestureEnabled: false,
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
      </SafeComponent>
    </NavigationErrorBoundary>
  );
}

// Add displayName for debugging
AuthNavigator.displayName = 'AuthNavigator';

export default AuthNavigator;
