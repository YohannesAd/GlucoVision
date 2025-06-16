import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer,
  ScreenHeader,
  FormInput,
  ValuePicker,
  OptionGrid,
  DateTimePicker,
  Button,
  FormError
} from '../../components/ui';
import { useAppState, useFormSubmission, useFormValidation, VALIDATION_RULES } from '../../hooks';
import { FORM_OPTIONS, generateGlucoseOptions } from '../../constants/formOptions';

/**
 * Add blood sugar readingScreen 
 */

type AddLogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddLog'>;

interface AddLogScreenProps {
  navigation: AddLogScreenNavigationProp;
}

export default function AddLogScreen({ navigation }: AddLogScreenProps) {
  const { auth, glucose, user } = useAppState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const glucoseUnit = user?.state?.profile?.preferences?.glucoseUnit || 'mg/dL';

  const { values, errors, isValid, setValue, validateAll, resetForm } = useFormValidation({
    rules: VALIDATION_RULES.glucoseLog,
    initialValues: {
      value: '',
      logType: '',
      notes: ''
    }
  });
  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async () => {
      if (!validateAll()) {
        throw new Error('Please fix validation errors');
      }

      const logData = {
        value: parseInt(values.value),
        unit: glucoseUnit,
        logType: values.logType,
        notes: values.notes?.trim() || undefined,
        timestamp: selectedDate.toISOString(),
        userId: auth?.state?.user?.id || ''
      };

      if (!glucose?.actions?.addLog) {
        throw new Error('Glucose service not available');
      }

      const result = await glucose.actions.addLog(logData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to save glucose reading');
      }
    },
    onSuccess: () => {
      resetForm();
      setSelectedDate(new Date());
      navigation.goBack();
    },
    successMessage: 'Glucose reading saved successfully!',
    showSuccessAlert: true
  });



  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <ScreenHeader
        title="Add Glucose Reading"
        subtitle="Track your blood sugar levels"
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Error Message */}
        <View className="mx-4 mb-4">
          <FormError error={error} />
        </View>

        {/* Form Container */}
        <View className="bg-white mx-4 rounded-xl p-6 shadow-sm">

          {/* Glucose Value Picker */}
          <ValuePicker
            label="Glucose Value *"
            placeholder={`Select glucose value (${glucoseUnit})`}
            value={values.value}
            onValueChange={(value) => setValue('value', value)}
            options={generateGlucoseOptions()}
            error={errors.value}
            className="mb-6"
          />

          {/* Meal Context Selection */}
          <OptionGrid
            label="When was this taken? *"
            subtitle="Select the timing of your reading"
            options={FORM_OPTIONS.mealContext}
            selectedValue={values.logType}
            onSelect={(value) => setValue('logType', value)}
            containerClassName="mb-6"
            columns={2}
          />

          {/* Date and Time */}
          <DateTimePicker
            label="Date & Time *"
            subtitle="When was this reading taken?"
            value={selectedDate}
            onDateTimeChange={setSelectedDate}
            className="mb-6"
          />

          {/* Notes */}
          <FormInput
            label="Notes (Optional)"
            placeholder="e.g., Feeling tired, after exercise, before medication..."
            value={values.notes}
            onChangeText={(text) => setValue('notes', text)}
            multiline
            numberOfLines={3}
            error={errors.notes}
            className="mb-6"
          />

          {/* Save Button */}
          <Button
            title={isLoading ? "Saving..." : "Save Reading"}
            onPress={() => handleSubmit({})}
            variant="primary"
            size="large"
            disabled={isLoading || !isValid}
          />
        </View>

        {/* Help Text */}
        <View className="mx-4 mt-4 p-4 bg-blue-50 rounded-xl">
          <Text className="text-blue-800 font-medium mb-2">💡 Tips for accurate readings:</Text>
          <Text className="text-blue-700 text-sm leading-5">
            • Wash your hands before testing{'\n'}
            • Use the side of your fingertip{'\n'}
            • Record readings at consistent times{'\n'}
            • Note any factors that might affect your levels
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
