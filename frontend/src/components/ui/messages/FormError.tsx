import React from 'react';
import { View, Text } from 'react-native';

/**
 * FormError - Standardized error display component
 * Reduces repetitive error handling patterns across forms
 */

interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export default function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null;

  return (
    <View className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <Text className="text-red-600 text-sm font-medium text-center">
        {error}
      </Text>
    </View>
  );
}
