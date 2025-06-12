import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, FormInput } from '../../components/ui';
import { OnboardingLayout, FieldPicker, OptionGrid } from '../../components/onboarding';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * OnboardingPersonalInfo2Screen - Second step of onboarding
 *
 * Collects lifestyle and medical information:
 * - Typical meals per day (1-5+)
 * - Physical activity level (Sedentary, Light, Moderate, Active)
 * - Insulin usage (Yes/No with optional follow-up)
 * - Medications (optional text input)
 * - Sleep duration (number input in hours)
 *
 * This information helps personalize recommendations and understand
 * the user's daily routine and medical management.
 */

type OnboardingPersonalInfo2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo2'>;

interface OnboardingPersonalInfo2ScreenProps {
  navigation: OnboardingPersonalInfo2ScreenNavigationProp;
}

export default function OnboardingPersonalInfo2Screen({ navigation }: OnboardingPersonalInfo2ScreenProps) {
  // Form state
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [takesInsulin, setTakesInsulin] = useState<boolean | null>(null);
  const [insulinType, setInsulinType] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');

  // Options data
  const mealsOptions = [
    { value: '1', label: '1 meal' },
    { value: '2', label: '2 meals' },
    { value: '3', label: '3 meals' },
    { value: '4', label: '4 meals' },
    { value: '5', label: '5 meals' },
    { value: '5+', label: '5+ meals' },
  ];

  const activityOptions = [
    { value: 'Sedentary', label: 'Sedentary' },
    { value: 'Light', label: 'Light' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Active', label: 'Active' },
  ];

  const insulinOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ];

  const insulinTypeOptions = [
    { value: 'Rapid-acting', label: 'Rapid-acting' },
    { value: 'Long-acting', label: 'Long-acting' },
    { value: 'Both', label: 'Both types' },
    { value: 'Other', label: 'Other' },
  ];

  const sleepOptions = [
    { value: '4', label: '4 hours' },
    { value: '5', label: '5 hours' },
    { value: '6', label: '6 hours' },
    { value: '7', label: '7 hours' },
    { value: '8', label: '8 hours' },
    { value: '9', label: '9 hours' },
    { value: '10', label: '10 hours' },
    { value: '11', label: '11 hours' },
    { value: '12', label: '12+ hours' },
  ];

  // Handle insulin selection
  const handleInsulinSelect = (value: string) => {
    const boolValue = value === 'true';
    setTakesInsulin(boolValue);
    if (!boolValue) {
      setInsulinType(''); // Clear insulin type if not taking insulin
    }
  };

  // Handle form submission and navigation to next step
  const handleNext = () => {
    // Basic validation
    if (!mealsPerDay || !activityLevel || takesInsulin === null || !sleepDuration) {
      Alert.alert('Required Fields', 'Please fill in all required fields to continue.');
      return;
    }

    // TODO: Save data to context or storage
    // const lifestyleInfo = {
    //   mealsPerDay,
    //   activityLevel,
    //   takesInsulin,
    //   insulinType: takesInsulin ? insulinType : null,
    //   currentMedications,
    //   sleepDuration
    // };

    // Navigate to next onboarding step
    navigation.navigate('OnboardingPersonalInfo3');
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={3}
      title="Lifestyle Information"
      subtitle="Tell us about your daily routine"
    >
      {/* Lifestyle Information Form */}
      <View className="mb-6">
        {/* Typical Meals Per Day */}
        <OptionGrid
          label="Typical Meals Per Day *"
          options={mealsOptions}
          selectedValue={mealsPerDay}
          onSelect={setMealsPerDay}
          columns={3}
        />

        {/* Physical Activity Level */}
        <OptionGrid
          label="Physical Activity Level *"
          options={activityOptions}
          selectedValue={activityLevel}
          onSelect={setActivityLevel}
          columns={2}
        />

        {/* Do You Use Insulin Question */}
        <OptionGrid
          label="Do You Use Insulin? *"
          options={insulinOptions}
          selectedValue={takesInsulin?.toString() || ''}
          onSelect={handleInsulinSelect}
          columns={2}
        />

        {/* Insulin Type Follow-up (conditional) */}
        {takesInsulin && (
          <OptionGrid
            label="Which type of insulin?"
            options={insulinTypeOptions}
            selectedValue={insulinType}
            onSelect={setInsulinType}
            columns={2}
          />
        )}

        {/* Current Medications */}
        <View className="mb-6">
          <FormInput
            label="Medications"
            placeholder="(Optional) List your current medications"
            value={currentMedications}
            onChangeText={setCurrentMedications}
            multiline
            numberOfLines={3}
            containerClassName="mb-0"
          />
        </View>

        {/* Sleep Duration */}
        <FieldPicker
          label="Sleep Duration (avg) *"
          subtitle="Hours per night"
          placeholder="Select sleep duration"
          value={sleepDuration}
          options={sleepOptions}
          onSelect={setSleepDuration}
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
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Step Information */}
      <Text className="text-center text-textSecondary text-sm">
        Step 2 of 3 - Lifestyle Information
      </Text>
    </OnboardingLayout>
  );
}