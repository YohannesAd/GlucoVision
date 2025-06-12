import React from 'react';
import { View, ScrollView } from 'react-native';
import { ScreenContainer, ScreenHeader, ProgressIndicator } from '../ui';

/**
 * OnboardingLayout - Shared layout for all onboarding screens
 * 
 * Features:
 * - Consistent progress indicator
 * - Standardized header layout
 * - Scrollable content area
 * - Professional structure for all onboarding pages
 */

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
}: OnboardingLayoutProps) {
  return (
    <ScreenContainer>
      {/* Progress Indicator */}
      <View className="px-6 pt-4">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </View>

      {/* Screen Header */}
      <View className="px-6 pb-4">
        <ScreenHeader
          title={title}
          subtitle={subtitle}
          containerClassName="items-center mb-6"
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </ScreenContainer>
  );
}
