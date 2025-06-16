import React from 'react';
import { View, Text } from 'react-native';

/**
 * ProgressIndicator - Reusable step progress indicator
 * 
 * Features:
 * - Shows current step and total steps
 * - Visual progress with filled/unfilled circles
 * - Connecting lines between steps
 * - Customizable styling
 * 
 * Used for:
 * - Onboarding flow progress
 * - Multi-step forms
 * - Wizard-style interfaces
 */

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  containerClassName?: string;
  activeStepColor?: string;
  inactiveStepColor?: string;
  activeLineColor?: string;
  inactiveLineColor?: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  containerClassName = 'flex-row justify-center mb-6',
  activeStepColor = 'bg-primary',
  inactiveStepColor = 'bg-gray-200',
  activeLineColor = 'bg-primary',
  inactiveLineColor = 'bg-gray-200',
}: ProgressIndicatorProps) {
  // Generate array of step numbers
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View className={containerClassName}>
      <View className="flex-row items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step <= currentStep ? activeStepColor : inactiveStepColor
              }`}
            >
              <Text
                className={`font-bold text-sm ${
                  step <= currentStep ? 'text-white' : 'text-gray-500'
                }`}
              >
                {step}
              </Text>
            </View>

            {/* Connecting Line (not after last step) */}
            {index < steps.length - 1 && (
              <View
                className={`w-8 h-1 mx-2 ${
                  step < currentStep ? activeLineColor : inactiveLineColor
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
