import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, ProgressIndicator } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

/**
 * OnboardingPersonalInfo3Screen - Third and final step of onboarding
 * 
 * Collects blood sugar history and preferences:
 * - Recent blood sugar readings (last 4 tests)
 * - Preferred glucose unit (mg/dL or mmol/L)
 * - Target glucose range
 * - Reminder preferences
 * - Testing frequency
 * 
 * This information helps establish baseline data for AI recommendations
 * and personalizes the app experience.
 */

type OnboardingPersonalInfo3ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo3'>;

interface OnboardingPersonalInfo3ScreenProps {
  navigation: OnboardingPersonalInfo3ScreenNavigationProp;
}

export default function OnboardingPersonalInfo3Screen({ navigation }: OnboardingPersonalInfo3ScreenProps) {
  // Auth context
  const { completeOnboarding } = useAuth();

  // Form state
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [reading1, setReading1] = useState('');
  const [reading2, setReading2] = useState('');
  const [reading3, setReading3] = useState('');
  const [reading4, setReading4] = useState('');
  const [targetMin, setTargetMin] = useState('');
  const [targetMax, setTargetMax] = useState('');
  const [testingFrequency, setTestingFrequency] = useState('');
  const [wantsReminders, setWantsReminders] = useState<boolean | null>(null);

  // Testing frequency options
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'twice_daily', label: 'Twice a day' },
    { value: 'multiple_daily', label: 'Multiple times a day' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as_needed', label: 'As needed' },
  ];

  // Handle unit selection
  const handleUnitSelect = (unit: 'mg/dL' | 'mmol/L') => {
    setGlucoseUnit(unit);
    // Clear readings when unit changes
    setReading1('');
    setReading2('');
    setReading3('');
    setReading4('');
    setTargetMin('');
    setTargetMax('');
  };

  // Handle frequency selection
  const handleFrequencySelect = (frequency: string) => {
    setTestingFrequency(frequency);
  };

  // Handle form completion and navigation to dashboard
  const handleComplete = async () => {
    // Basic validation - at least one reading is required
    if (!reading1 && !reading2 && !reading3 && !reading4) {
      Alert.alert(
        'Blood Sugar Readings',
        'Please enter at least one recent blood sugar reading to help us provide better recommendations.'
      );
      return;
    }

    if (!testingFrequency || wantsReminders === null) {
      Alert.alert('Required Fields', 'Please complete all required fields to finish setup.');
      return;
    }

    try {
      // TODO: Save all onboarding data to context or storage
      // const bloodSugarInfo = {
      //   glucoseUnit,
      //   recentReadings: [reading1, reading2, reading3, reading4].filter(Boolean),
      //   targetRange: { min: targetMin, max: targetMax },
      //   testingFrequency,
      //   wantsReminders,
      // };

      // Complete onboarding in AuthContext
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
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} totalSteps={3} />

        {/* Screen Header */}
        <ScreenHeader
          title="Blood Sugar & Preferences"
          subtitle="Help us personalize your experience"
          containerClassName="items-center mb-6"
        />

        {/* Blood Sugar Information Form */}
        <View className="mb-6">
          {/* Glucose Unit Selection */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">Preferred Unit *</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => handleUnitSelect('mg/dL')}
                className={`flex-1 p-3 rounded-xl border ${
                  glucoseUnit === 'mg/dL'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  glucoseUnit === 'mg/dL' ? 'text-primary' : 'text-textPrimary'
                }`}>
                  mg/dL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUnitSelect('mmol/L')}
                className={`flex-1 p-3 rounded-xl border ${
                  glucoseUnit === 'mmol/L'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  glucoseUnit === 'mmol/L' ? 'text-primary' : 'text-textPrimary'
                }`}>
                  mmol/L
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Blood Sugar Readings */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">
              Recent Blood Sugar Readings ({glucoseUnit})
            </Text>
            <Text className="text-textSecondary text-sm mb-3">
              Enter your last 4 readings (most recent first). At least one is required.
            </Text>
            
            <View className="space-y-3">
              <FormInput
                label="Most Recent"
                placeholder={`Enter reading in ${glucoseUnit}`}
                value={reading1}
                onChangeText={setReading1}
                keyboardType="numeric"
                containerClassName="mb-0"
              />
              <FormInput
                label="2nd Most Recent"
                placeholder={`Enter reading in ${glucoseUnit}`}
                value={reading2}
                onChangeText={setReading2}
                keyboardType="numeric"
                containerClassName="mb-0"
              />
              <FormInput
                label="3rd Most Recent"
                placeholder={`Enter reading in ${glucoseUnit}`}
                value={reading3}
                onChangeText={setReading3}
                keyboardType="numeric"
                containerClassName="mb-0"
              />
              <FormInput
                label="4th Most Recent"
                placeholder={`Enter reading in ${glucoseUnit}`}
                value={reading4}
                onChangeText={setReading4}
                keyboardType="numeric"
                containerClassName="mb-0"
              />
            </View>
          </View>

          {/* Target Range */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">
              Target Range ({glucoseUnit})
            </Text>
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <FormInput
                  label="Min"
                  placeholder="Min target"
                  value={targetMin}
                  onChangeText={setTargetMin}
                  keyboardType="numeric"
                  containerClassName="mb-0"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Max"
                  placeholder="Max target"
                  value={targetMax}
                  onChangeText={setTargetMax}
                  keyboardType="numeric"
                  containerClassName="mb-0"
                />
              </View>
            </View>
          </View>

          {/* Testing Frequency */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">How often do you test? *</Text>
            <View className="space-y-2">
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleFrequencySelect(option.value)}
                  className={`p-3 rounded-xl border ${
                    testingFrequency === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Text className={`font-medium ${
                    testingFrequency === option.value ? 'text-primary' : 'text-textPrimary'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reminder Preferences */}
          <View className="mb-6">
            <Text className="text-textPrimary font-medium mb-2">Would you like testing reminders? *</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setWantsReminders(true)}
                className={`flex-1 p-3 rounded-xl border ${
                  wantsReminders === true
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  wantsReminders === true ? 'text-primary' : 'text-textPrimary'
                }`}>
                  Yes, remind me
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWantsReminders(false)}
                className={`flex-1 p-3 rounded-xl border ${
                  wantsReminders === false
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  wantsReminders === false ? 'text-primary' : 'text-textPrimary'
                }`}>
                  No reminders
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row space-x-3">
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
          Step 3 of 3 - Almost done!
        </Text>
      </FormContainer>
    </ScreenContainer>
  );
}
