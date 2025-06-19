import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, OnboardingLayout, FieldPicker, OptionGrid } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState, useFormSubmission } from '../../hooks';
import { FORM_OPTIONS, generateGlucoseOptions } from '../../constants/formOptions';

/**
 * OnboardingPersonalInfo3Screen - Third and final step of onboarding
 * Collects initial glucose logs:
 * This information helps establish baseline data for AI recommendations
 * and provides initial glucose history for trend analysis.
 */

type OnboardingPersonalInfo3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo3'>;

interface OnboardingPersonalInfo3ScreenProps {
  navigation: OnboardingPersonalInfo3ScreenNavigationProp;
}

export default function OnboardingPersonalInfo3Screen({ navigation }: OnboardingPersonalInfo3ScreenProps) {
  const { auth, user } = useAppState();
  const [logs, setLogs] = useState([
    { value: '', timeOfDay: '' },
    { value: '', timeOfDay: '' },
    { value: '', timeOfDay: '' },
    { value: '', timeOfDay: '' }
  ]);

  const updateLog = (index: number, field: 'value' | 'timeOfDay', value: string) => {
    const newLogs = [...logs];
    newLogs[index][field] = value;
    setLogs(newLogs);
  };
  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async (formData) => {
      // Validate all logs are complete
      const isComplete = logs.every(log => log.value && log.timeOfDay);
      if (!isComplete) {
        throw new Error('Please complete all 4 glucose logs with both value and time of day to continue');
      }

      const step3Data = {
        glucose_readings: logs.map((log, index) => {
          // Create timestamps spread over the last 24 hours for variety
          const hoursAgo = (index + 1) * 6; // 6, 12, 18, 24 hours ago
          const readingTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

          return {
            glucose_value: parseInt(log.value),
            reading_time: readingTime.toISOString(),
            reading_type: log.timeOfDay
          };
        }),
        preferred_unit: 'mg/dL',
        target_range_min: 80,
        target_range_max: 180,
      };

      if (!auth?.state?.token || !user?.actions) {
        throw new Error('Authentication required');
      }

      const result = await user.actions.completeOnboarding(step3Data);

      if (!result.success) {
        throw new Error(result.error || 'Failed to complete setup');
      }

      return result.data;
    },
    onSuccess: () => {
     
    },
    successMessage: 'Setup Complete! Welcome to GlucoVision!',
    showSuccessAlert: true
  });

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Initial Glucose Logs"
      subtitle="Enter your recent blood sugar readings"
    >
        {/* Glucose Logs Form */}
        <View className="mb-6">
          {/* Error Message */}
          {error && (
            <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-600 text-sm font-medium text-center">
                {error}
              </Text>
            </View>
          )}

          {/* Clean Glucose Log Forms */}
          {logs.map((log, index) => (
            <View key={index} className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-textPrimary font-semibold mb-4 text-center">
                Glucose Log {index + 1} *
              </Text>

              {/* Glucose Value Picker */}
              <FieldPicker
                label="Glucose Value *"
                subtitle="Select your glucose reading in mg/dL"
                placeholder="Select glucose value (mg/dL)"
                value={log.value}
                options={generateGlucoseOptions()}
                onSelect={(value: string) => updateLog(index, 'value', value)}
                containerClassName="mb-4"
              />

              {/* Time of Day Selection */}
              <OptionGrid
                label="When was this taken? *"
                subtitle="Select the timing of your reading"
                options={FORM_OPTIONS.mealContext}
                selectedValue={log.timeOfDay}
                onSelect={(value) => updateLog(index, 'timeOfDay', value)}
                containerClassName="mb-2"
                columns={2}
              />
            </View>
          ))}

          {/* Navigation Buttons */}
          <View className="flex-row gap-3 mt-4">
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="medium"
              style={{ flex: 1 }}
            />
            <Button
              title={isLoading ? "Completing..." : "Complete Setup"}
              onPress={() => handleSubmit({ logs })}
              variant="primary"
              size="medium"
              disabled={isLoading || !logs.every(log => log.value && log.timeOfDay)}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Step Information */}
        <Text className="text-center text-textSecondary text-sm">
          Step 3 of 3 - Initial Glucose Logs
        </Text>
    </OnboardingLayout>
  );
}
