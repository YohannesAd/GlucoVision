import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, OnboardingLayout, FieldPicker, OptionGrid, DatePicker, FormError } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState, useFormSubmission, useFormValidation, VALIDATION_RULES } from '../../hooks';
import { FORM_OPTIONS, generateYearOptions } from '../../constants/formOptions';

/**
 * OnboardingPersonalInfo1Screen - onboarding step 1
 */

type OnboardingPersonalInfo1ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo1'>;

interface OnboardingPersonalInfo1ScreenProps {
  navigation: OnboardingPersonalInfo1ScreenNavigationProp;
}

export default function OnboardingPersonalInfo1Screen({ navigation }: OnboardingPersonalInfo1ScreenProps) {
  const { auth, user } = useAppState();
  const [dateOfBirth, setDateOfBirth] = useState({ day: '', month: '', year: '' });
  const { values, isValid, setValue, validateAll } = useFormValidation({
    rules: VALIDATION_RULES.onboardingStep1,
    initialValues: {
      gender: '',
      diabetesType: '',
      diagnosedYear: ''
    }
  });

  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async (formData) => {
      if (!validateAll() || !dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
        throw new Error('Please fill in all required fields to continue');
      }

      const step1Data = {
        date_of_birth: `${dateOfBirth.year}-${dateOfBirth.month.padStart(2, '0')}-${dateOfBirth.day.padStart(2, '0')}`,
        gender: values.gender.toLowerCase().replace(' ', '_'),
        diabetes_type: values.diabetesType.toLowerCase().replace(' ', ''),
        diagnosis_date: `${values.diagnosedYear}-01-01`,
      };

      if (!auth?.state?.token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      if (!user?.actions) {
        throw new Error('User actions not available. Please try again.');
      }

      const result = await user.actions.updateOnboardingStep1(step1Data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to save information');
      }

      return result.data;
    },
    onSuccess: () => navigation.navigate('OnboardingPersonalInfo2'),
    successMessage: 'Personal information saved!',
    showSuccessAlert: false
  });



  // Handle date selection
  const handleDateSelect = (day: string, month: string, year: string) => {
    setDateOfBirth({ day, month, year });
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

        {/* Error Message */}
        <FormError error={error} />

        {/* Gender Selection */}
        <OptionGrid
          label="Gender *"
          options={FORM_OPTIONS.gender}
          selectedValue={values.gender}
          onSelect={(value) => setValue('gender', value)}
          columns={3}
        />

        {/* Diabetes Type Selection */}
        <OptionGrid
          label="Diabetes Type *"
          options={FORM_OPTIONS.diabetesType}
          selectedValue={values.diabetesType}
          onSelect={(value) => setValue('diabetesType', value)}
          columns={2}
        />

        {/* Diagnosed Since Year */}
        <FieldPicker
          label="Diagnosed Since *"
          subtitle="Helps personalize trend depth"
          placeholder="Select Year"
          value={values.diagnosedYear}
          options={generateYearOptions()}
          onSelect={(value) => setValue('diagnosedYear', value)}
        />

        {/* Continue Button */}
        <View className="mt-4">
          <Button
            title={isLoading ? "Saving..." : "Continue"}
            onPress={() => handleSubmit({ ...values, dateOfBirth })}
            variant="primary"
            size="large"
            disabled={isLoading || !isValid || !dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year}
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
