import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, FormInput, OnboardingLayout, FieldPicker, OptionGrid, FormError } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppState, useFormSubmission, useFormValidation, VALIDATION_RULES } from '../../hooks';
import { FORM_OPTIONS } from '../../constants/formOptions';

/**
 * OnboardingPersonalInfo2Screen - Second step of onboarding
 * This information helps personalize recommendations and understand
 * the user's daily routine and medical management.
 */

type OnboardingPersonalInfo2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo2'>;

interface OnboardingPersonalInfo2ScreenProps {
  navigation: OnboardingPersonalInfo2ScreenNavigationProp;
}

export default function OnboardingPersonalInfo2Screen({ navigation }: OnboardingPersonalInfo2ScreenProps) {
  // Use our powerful new hooks
  const { auth, user } = useAppState();
  const [takesInsulin, setTakesInsulin] = useState<boolean | null>(null);

  const { values, isValid, setValue, validateAll } = useFormValidation({
    rules: VALIDATION_RULES.onboardingStep2,
    initialValues: {
      mealsPerDay: '',
      activityLevel: '',
      insulinType: '',
      currentMedications: '',
      sleepDuration: ''
    }
  });



  // Form submission
  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async (formData) => {
      if (!validateAll() || takesInsulin === null) {
        throw new Error('Please fill in all required fields to continue');
      }

      // Map frontend activity values to backend enum values
      const activityMapping: Record<string, string> = {
        'Sedentary': 'low',
        'Light': 'low',
        'Moderate': 'moderate',
        'Active': 'high'
      };

      // Handle meals per day (convert "5+" to 6)
      const mealsPerDay = values.mealsPerDay === '5+' ? 6 : parseInt(values.mealsPerDay);

      // Handle sleep duration (convert "12+ hours" to 12)
      const sleepDuration = values.sleepDuration === '12' ? 12 : parseInt(values.sleepDuration);

      const step2Data = {
        meals_per_day: mealsPerDay,
        activity_level: activityMapping[values.activityLevel] || 'moderate',
        uses_insulin: takesInsulin,
        current_medications: values.currentMedications ? [values.currentMedications] : [],
        sleep_duration: sleepDuration,
      };

      // Debug logging
      console.log('Step 2 Data being sent:', step2Data);
      console.log('Original form values:', values);
      console.log('Takes insulin:', takesInsulin);

      if (!auth?.state?.token || !user?.actions) {
        throw new Error('Authentication required');
      }

      const result = await user.actions.updateOnboardingStep2(step2Data);

      // Debug logging
      console.log('Step 2 API Result:', result);

      if (!result.success) {
        let errorMessage = 'Failed to save information';

        if (typeof result.error === 'string') {
          errorMessage = result.error;
        } else if (result.error && typeof result.error === 'object') {
          // Handle error object with potential message or detail properties
          const errorObj = result.error as any;
          errorMessage = errorObj.message || errorObj.detail || errorMessage;
        }

        throw new Error(errorMessage);
      }
    },
    onSuccess: () => navigation.navigate('OnboardingPersonalInfo3'),
    successMessage: 'Lifestyle information saved!',
    showSuccessAlert: false
  });

  // Handle insulin selection
  const handleInsulinSelect = (value: string) => {
    const boolValue = value === 'true';
    setTakesInsulin(boolValue);
    if (!boolValue) setValue('insulinType', '');
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
        {/* Error Message */}
        <FormError error={error} />

        {/* Typical Meals Per Day */}
        <OptionGrid
          label="Typical Meals Per Day *"
          options={FORM_OPTIONS.meals}
          selectedValue={values.mealsPerDay}
          onSelect={(value) => setValue('mealsPerDay', value)}
          columns={3}
        />

        {/* Physical Activity Level */}
        <OptionGrid
          label="Physical Activity Level *"
          options={FORM_OPTIONS.activity}
          selectedValue={values.activityLevel}
          onSelect={(value) => setValue('activityLevel', value)}
          columns={2}
        />

        {/* Do You Use Insulin Question */}
        <OptionGrid
          label="Do You Use Insulin? *"
          options={FORM_OPTIONS.insulin}
          selectedValue={takesInsulin?.toString() || ''}
          onSelect={handleInsulinSelect}
          columns={2}
        />

        {/* Insulin Type Follow-up (conditional) */}
        {takesInsulin && (
          <OptionGrid
            label="Which type of insulin?"
            options={FORM_OPTIONS.insulinType}
            selectedValue={values.insulinType}
            onSelect={(value) => setValue('insulinType', value)}
            columns={2}
          />
        )}

        {/* Current Medications */}
        <FormInput
          label="Medications"
          placeholder="(Optional) List your current medications"
          value={values.currentMedications}
          onChangeText={(text) => setValue('currentMedications', text)}
          multiline
          numberOfLines={3}
          containerClassName="mb-6"
        />

        {/* Sleep Duration */}
        <FieldPicker
          label="Sleep Duration (avg) *"
          subtitle="Hours per night"
          placeholder="Select sleep duration"
          value={values.sleepDuration}
          options={FORM_OPTIONS.sleep}
          onSelect={(value) => setValue('sleepDuration', value)}
        />

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
            title={isLoading ? "Saving..." : "Continue"}
            onPress={() => handleSubmit({ ...values, takesInsulin })}
            variant="primary"
            size="large"
            disabled={isLoading || !isValid || takesInsulin === null}
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