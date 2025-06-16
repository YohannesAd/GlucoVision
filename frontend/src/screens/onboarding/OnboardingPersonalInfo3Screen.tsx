import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, OnboardingLayout, GlucoseLogCard } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState, useFormSubmission, useFormValidation, VALIDATION_RULES } from '../../hooks';

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
        glucose_readings: logs.map(log => ({
          glucose_value: parseInt(log.value),
          reading_time: new Date().toISOString(), // Use current time as default
          reading_type: log.timeOfDay
        })),
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

          {/* Glucose Log Cards */}
          {logs.map((log, index) => (
            <GlucoseLogCard
              key={index}
              logNumber={index + 1}
              value={log.value}
              timeOfDay={log.timeOfDay}
              onValuePress={() => {
                Alert.prompt(
                  `Glucose Log ${index + 1}`,
                  'Enter glucose value (mg/dL):',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Save',
                      onPress: (value) => {
                        if (value && !isNaN(Number(value))) {
                          updateLog(index, 'value', value);
                        } else if (value) {
                          Alert.alert('Invalid Input', 'Please enter a valid number');
                        }
                      },
                    },
                  ],
                  'plain-text',
                  log.value // Pre-fill with current value
                );
              }}
              onTimeSelect={(timeOfDay: string) => updateLog(index, 'timeOfDay', timeOfDay)}
            />
          ))}

          {/* Navigation Buttons */}
          <View className="flex-row gap-3 mt-4">
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              size="large"
              style={{ flex: 1 }}
            />
            <Button
              title={isLoading ? "Completing..." : "Complete Setup"}
              onPress={() => handleSubmit({ logs })}
              variant="primary"
              size="large"
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
