import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// Import Navigators
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';

/**
 * RootNavigator - Main navigation controller for the app
 * 
 * This component determines which navigator to show based on:
 * - Authentication status
 * - Onboarding completion status
 * 
 * Navigation Flow:
 * 1. Not authenticated → AuthNavigator (Landing, Login, SignUp)
 * 2. Authenticated but not onboarded → OnboardingNavigator (3-step onboarding)
 * 3. Authenticated and onboarded → MainNavigator (Dashboard and main app)
 * 
 * Features:
 * - Automatic navigation based on user state
 * - Persistent authentication state
 * - Smooth transitions between navigation stacks
 */

export default function RootNavigator() {
  const { state } = useAuth();
  const { isAuthenticated, user, isLoading } = state;

  // Show loading screen while checking auth state
  if (isLoading) {
    // TODO: Create a proper loading screen component
    return null; // For now, return null during loading
  }

  // Determine which navigator to show
  const getNavigator = () => {
    // User not authenticated - show auth flow
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
    }

    // User authenticated but hasn't completed onboarding
    if (!user.hasCompletedOnboarding) {
      return <OnboardingNavigator />;
    }

    // User authenticated and onboarded - show main app
    return <MainNavigator />;
  };

  return (
    <NavigationContainer>
      {getNavigator()}
    </NavigationContainer>
  );
}
