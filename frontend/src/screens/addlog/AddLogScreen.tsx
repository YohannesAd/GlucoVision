import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer,
  NavigationHeader,
  FormInput,
  FieldPicker,
  OptionGrid,
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
  const glucoseUnit = user?.state?.profile?.preferences?.glucoseUnit || 'mg/dL';

  // Generate date options (last 7 days)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      let label;
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Yesterday';
      else label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      options.push({
        value: date.toISOString().split('T')[0], // YYYY-MM-DD format
        label: label
      });
    }
    return options;
  };

  // Generate time options (every 30 minutes)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        options.push({
          value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label: timeString
        });
      }
    }
    return options;
  };

  const { values, errors, isValid, setValue, validateAll, resetForm } = useFormValidation({
    rules: VALIDATION_RULES.glucoseLog,
    initialValues: {
      value: '',
      logType: '',
      notes: '',
      date: new Date().toISOString().split('T')[0], // Default to today
      time: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) // Default to current time
    }
  });
  const { isLoading, error, handleSubmit } = useFormSubmission({
    onSubmit: async () => {
      if (!validateAll()) {
        throw new Error('Please fix validation errors');
      }

      // Combine date and time into a timestamp
      const combinedDateTime = new Date(`${values.date}T${values.time}:00`);

      const logData = {
        value: parseInt(values.value),
        unit: glucoseUnit,
        logType: values.logType,
        notes: values.notes?.trim() || undefined,
        timestamp: combinedDateTime.toISOString(),
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
      navigation.goBack();
    },
    successMessage: 'Glucose reading saved successfully!',
    showSuccessAlert: true
  });



  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <NavigationHeader
        title="Add Glucose Reading"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
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
          <FieldPicker
            label="Glucose Value *"
            subtitle={`Select your glucose reading in ${glucoseUnit}`}
            placeholder={`Select glucose value (${glucoseUnit})`}
            value={values.value}
            options={generateGlucoseOptions()}
            onSelect={(value: string) => setValue('value', value)}
            containerClassName="mb-6"
          />
          {errors.value && (
            <Text className="text-red-500 text-sm mt-1 mb-4">{errors.value}</Text>
          )}

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

          {/* Date Selection */}
          <FieldPicker
            label="Date *"
            subtitle="When was this reading taken?"
            placeholder="Select date"
            value={values.date}
            options={generateDateOptions()}
            onSelect={(value: string) => setValue('date', value)}
            containerClassName="mb-6"
          />
          {errors.date && (
            <Text className="text-red-500 text-sm mt-1 mb-4">{errors.date}</Text>
          )}

          {/* Time Selection */}
          <FieldPicker
            label="Time *"
            subtitle="What time was this reading taken?"
            placeholder="Select time"
            value={values.time}
            options={generateTimeOptions()}
            onSelect={(value: string) => setValue('time', value)}
            containerClassName="mb-6"
          />
          {errors.time && (
            <Text className="text-red-500 text-sm mt-1 mb-4">{errors.time}</Text>
          )}

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
