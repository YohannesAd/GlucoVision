import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';

/**
 * FormInput - Reusable input field with label and error handling
 *
 * Features:
 * - Consistent styling across all forms
 * - Built-in error state handling
 * - Password visibility toggle for secure fields
 * - Customizable styling via className props
 * - Extends all TextInput props
 */

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  showPasswordToggle?: boolean; // New prop for password toggle
}

export default function FormInput({
  label,
  error,
  containerClassName = 'mb-4',
  labelClassName = 'text-textPrimary font-medium mb-2',
  inputClassName = 'bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-textPrimary',
  showPasswordToggle = false,
  secureTextEntry,
  ...textInputProps
}: FormInputProps) {
  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if this is a password field
  const isPasswordField = showPasswordToggle || secureTextEntry;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className={containerClassName}>
      {/* Input Label */}
      <Text className={labelClassName}>{label}</Text>

      {/* Input Field Container */}
      <View className="relative">
        <TextInput
          className={`${inputClassName} ${error ? 'border-error' : ''} ${
            isPasswordField ? 'pr-12' : ''
          }`}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPasswordField && !isPasswordVisible}
          {...textInputProps}
        />

        {/* Password Toggle Button */}
        {isPasswordField && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            style={{ transform: [{ translateY: -12 }] }}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 items-center justify-center">
              <Text className="text-gray-500 text-base font-medium">
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-error text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
