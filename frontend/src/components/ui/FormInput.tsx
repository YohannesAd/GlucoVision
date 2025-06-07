import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

/**
 * FormInput - Reusable input field with label and error handling
 *
 * Features:
 * - Consistent styling across all forms
 * - Built-in error state handling
 * - Customizable styling via className props
 * - Extends all TextInput props
 */

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export default function FormInput({
  label,
  error,
  containerClassName = 'mb-4',
  labelClassName = 'text-textPrimary font-medium mb-2',
  inputClassName = 'bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary',
  ...textInputProps
}: FormInputProps) {
  return (
    <View className={containerClassName}>
      {/* Input Label */}
      <Text className={labelClassName}>{label}</Text>

      {/* Input Field */}
      <TextInput
        className={`${inputClassName} ${error ? 'border-error' : ''}`}
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />

      {/* Error Message */}
      {error && (
        <Text className="text-error text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
