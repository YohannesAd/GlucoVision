import React, { useState } from 'react';
import { View, Text, Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../components/ui';
import { OnboardingLayout, FieldPicker, GlucoseLogCard } from '../../components/onboarding';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { onboardingService, OnboardingStep3Data, GlucoseReading } from '../../services';

/**
 * OnboardingPersonalInfo3Screen - Third and final step of onboarding
 *
 * Collects initial glucose logs:
 * - Log 1-4: Blood glucose values (mg/dL) with number input
 * - Log 1-4: Time of day (Fasting, Before Meal, After Meal, Bedtime)
 * - At least 4 total logs required
 *
 * This information helps establish baseline data for AI recommendations
 * and provides initial glucose history for trend analysis.
 */

type OnboardingPersonalInfo3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo3'>;

interface OnboardingPersonalInfo3ScreenProps {
  navigation: OnboardingPersonalInfo3ScreenNavigationProp;
}

export default function OnboardingPersonalInfo3Screen({ navigation }: OnboardingPersonalInfo3ScreenProps) {
  // Auth context
  const { completeOnboarding, state } = useAuth();

  // Form state for glucose logs
  const [log1Value, setLog1Value] = useState('');
  const [log1Time, setLog1Time] = useState('');
  const [log2Value, setLog2Value] = useState('');
  const [log2Time, setLog2Time] = useState('');
  const [log3Value, setLog3Value] = useState('');
  const [log3Time, setLog3Time] = useState('');
  const [log4Value, setLog4Value] = useState('');
  const [log4Time, setLog4Time] = useState('');

  // Picker states
  const [showValuePicker, setShowValuePicker] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);



  // Glucose value options (mg/dL)
  const glucoseOptions = [];
  for (let i = 50; i <= 500; i += 5) {
    glucoseOptions.push({ value: i.toString(), label: `${i} mg/dL` });
  }

  // Helper functions for value picker
  const openValuePicker = (logIndex: number) => {
    setCurrentLogIndex(logIndex);
    setShowValuePicker(true);
  };

  const handleValueSelect = (value: string) => {
    switch (currentLogIndex) {
      case 1:
        setLog1Value(value);
        break;
      case 2:
        setLog2Value(value);
        break;
      case 3:
        setLog3Value(value);
        break;
      case 4:
        setLog4Value(value);
        break;
    }
    setShowValuePicker(false);
  };

  const getCurrentValue = () => {
    switch (currentLogIndex) {
      case 1:
        return log1Value;
      case 2:
        return log2Value;
      case 3:
        return log3Value;
      case 4:
        return log4Value;
      default:
        return '';
    }
  };



  // Handle form completion and navigation to dashboard
  const handleComplete = async () => {
    // Basic validation - all 4 logs are required
    if (!log1Value || !log1Time || !log2Value || !log2Time || !log3Value || !log3Time || !log4Value || !log4Time) {
      Alert.alert(
        'Required Fields',
        'Please complete all 4 glucose logs with both value and time of day to continue.'
      );
      return;
    }

    try {
      // Prepare glucose readings data
      const glucoseReadings: GlucoseReading[] = [
        { value: parseInt(log1Value), timeOfDay: log1Time as any },
        { value: parseInt(log2Value), timeOfDay: log2Time as any },
        { value: parseInt(log3Value), timeOfDay: log3Time as any },
        { value: parseInt(log4Value), timeOfDay: log4Time as any },
      ];

      // Prepare step 3 data
      const step3Data: OnboardingStep3Data = {
        glucoseReadings,
        preferredUnit: 'mg/dL',
        targetRangeMin: 80,
        targetRangeMax: 180,
      };

      // Submit step 3 data to backend
      if (state.token) {
        await onboardingService.submitStep3(step3Data, state.token);
      }

      // Update auth context with completed onboarding status
      await completeOnboarding();

      // Show completion message
      Alert.alert(
        'Setup Complete!',
        'Welcome to GlucoVision! Your personalized diabetes management journey starts now.',
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Navigation will be handled automatically by RootNavigator
              // based on the user's onboarding completion status
            },
          },
        ]
      );
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={3}
      title="Initial Glucose Logs"
      subtitle="Enter your recent blood sugar readings"
    >
        {/* Glucose Logs Form */}
        <View className="mb-6">
          <GlucoseLogCard
            logNumber={1}
            value={log1Value}
            timeOfDay={log1Time}
            onValuePress={() => openValuePicker(1)}
            onTimeSelect={setLog1Time}
          />

          <GlucoseLogCard
            logNumber={2}
            value={log2Value}
            timeOfDay={log2Time}
            onValuePress={() => openValuePicker(2)}
            onTimeSelect={setLog2Time}
          />

          <GlucoseLogCard
            logNumber={3}
            value={log3Value}
            timeOfDay={log3Time}
            onValuePress={() => openValuePicker(3)}
            onTimeSelect={setLog3Time}
          />

          <GlucoseLogCard
            logNumber={4}
            value={log4Value}
            timeOfDay={log4Time}
            onValuePress={() => openValuePicker(4)}
            onTimeSelect={setLog4Time}
          />

          {/* Navigation Buttons */}
          <View className="flex-row gap-3 mt-4">
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              size="large"
              style={{ flex: 1 }}
            />
            <Button
              title="Complete Setup"
              onPress={handleComplete}
              variant="primary"
              size="large"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Step Information */}
        <Text className="text-center text-textSecondary text-sm">
          Step 3 of 3 - Initial Glucose Logs
        </Text>

        {/* Glucose Value Picker Modal */}
        <Modal
          visible={showValuePicker}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 max-h-96">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-textPrimary">Glucose Value</Text>
                <TouchableOpacity onPress={() => setShowValuePicker(false)}>
                  <Text className="text-primary font-medium">Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {glucoseOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`py-3 px-4 rounded-lg mb-2 ${
                      getCurrentValue() === option.value ? 'bg-primary' : 'bg-gray-50'
                    }`}
                    onPress={() => handleValueSelect(option.value)}
                  >
                    <Text className={`text-center font-medium ${
                      getCurrentValue() === option.value ? 'text-white' : 'text-textPrimary'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
    </OnboardingLayout>
  );
}
