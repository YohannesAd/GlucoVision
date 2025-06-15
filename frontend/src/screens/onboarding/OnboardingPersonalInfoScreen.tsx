import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from '../../components/ui';
import { OnboardingLayout, FieldPicker, OptionGrid, DatePicker } from '../../components/onboarding';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { onboardingService } from '../../services/onboarding/onboardingService';

/**
 * OnboardingPersonalInfo1Screen - First step of onboarding
 *
 * Collects basic personal and diabetes information:
 * - Date of birth (required for age-based risk factors)
 * - Gender (Male, Female, Prefer not to say)
 * - Diabetes type (Type 1, Type 2, Pre-diabetic, Gestational)
 * - Diagnosed since (year picker for trend depth personalization)
 *
 * This information helps personalize the app experience and
 * provides context for health recommendations.
 */

type OnboardingPersonalInfo1ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo1'>;

interface OnboardingPersonalInfo1ScreenProps {
  navigation: OnboardingPersonalInfo1ScreenNavigationProp;
}

export default function OnboardingPersonalInfo1Screen({ navigation }: OnboardingPersonalInfo1ScreenProps) {
  const { state } = useAuth();

  // Form state
  const [dateOfBirth, setDateOfBirth] = useState({ day: '', month: '', year: '' });
  const [gender, setGender] = useState('');
  const [diabetesType, setDiabetesType] = useState('');
  const [diagnosedYear, setDiagnosedYear] = useState('');

  // Options data
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];

  const diabetesTypeOptions = [
    { value: 'Type 1', label: 'Type 1' },
    { value: 'Type 2', label: 'Type 2' },
    { value: 'Pre-diabetic', label: 'Pre-diabetic' },
    { value: 'Gestational', label: 'Gestational' },
  ];

  const generateDiagnosedYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  // Handle date selection
  const handleDateSelect = (day: string, month: string, year: string) => {
    setDateOfBirth({ day, month, year });
  };

  // Handle form submission and navigation to next step
  const handleNext = async () => {
    // Basic validation
    if (!dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year || !gender || !diabetesType || !diagnosedYear) {
      Alert.alert('Required Fields', 'Please fill in all required fields to continue.');
      return;
    }

    try {
      // Prepare and submit onboarding data
      const step1Data = {
        dateOfBirth: `${dateOfBirth.year}-${dateOfBirth.month.padStart(2, '0')}-${dateOfBirth.day.padStart(2, '0')}`,
        gender: gender.toLowerCase().replace(' ', '_'),
        diabetesType: diabetesType.toLowerCase().replace(' ', ''),
        diagnosisDate: `${diagnosedYear}-01-01`,
      };

      if (state.token) {
        await onboardingService.submitStep1(step1Data, state.token);
        navigation.navigate('OnboardingPersonalInfo2');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save information. Please try again.');
      console.error('Step 1 submission error:', error);
    }
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={3}
      title="Personal Information"
      subtitle="Tell us about yourself"
    >
      {/* Personal Information Form */}
      <View className="mb-6">
        {/* Date of Birth */}
        <DatePicker
          label="Date of Birth *"
          subtitle="Required for age-based risk factors"
          value={dateOfBirth}
          onSelect={handleDateSelect}
        />

        {/* Gender Selection */}
        <OptionGrid
          label="Gender *"
          options={genderOptions}
          selectedValue={gender}
          onSelect={setGender}
          columns={3}
        />

        {/* Diabetes Type Selection */}
        <OptionGrid
          label="Diabetes Type *"
          options={diabetesTypeOptions}
          selectedValue={diabetesType}
          onSelect={setDiabetesType}
          columns={2}
        />

        {/* Diagnosed Since Year */}
        <FieldPicker
          label="Diagnosed Since *"
          subtitle="Helps personalize trend depth"
          placeholder="Select Year"
          value={diagnosedYear}
          options={generateDiagnosedYearOptions()}
          onSelect={setDiagnosedYear}
        />

        {/* Continue Button */}
        <View className="mt-4">
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={{ width: '100%' }}
          />
        </View>
      </View>

      {/* Step Information */}
      <Text className="text-center text-textSecondary text-sm">
        Step 1 of 3 - Personal Information
      </Text>
    </OnboardingLayout>
  );
}
