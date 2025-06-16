import React from 'react';
import { View, Text } from 'react-native';

/**
 * ErrorMessage Component
 * 
 * Professional error display component used across all screens
 * for form validation, API errors, and user feedback
 * 
 * Used in:
 * - LoginScreen (form validation)
 * - SignUpScreen (form validation) 
 * - ViewLogsScreen (no data errors)
 * - AddLogScreen (validation errors)
 * - All auth screens (API errors)
 * - All onboarding screens (validation)
 */

interface ErrorMessageProps {
  message: string;
  variant?: 'inline' | 'card' | 'banner';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorMessage({
  message,
  variant = 'inline',
  size = 'medium',
  showIcon = true,
  onDismiss,
  className = ''
}: ErrorMessageProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'bg-red-50 border border-red-200 rounded-lg p-4';
      case 'banner':
        return 'bg-red-50 border-l-4 border-red-400 p-4';
      case 'inline':
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      case 'medium':
      default:
        return 'text-sm';
    }
  };

  if (variant === 'inline') {
    return (
      <Text className={`text-error ${getSizeStyles()} ${className}`}>
        {showIcon && '⚠️ '}{message}
      </Text>
    );
  }

  return (
    <View className={`${getVariantStyles()} ${className}`}>
      <View className="flex-row items-start">
        {showIcon && (
          <Text className="text-error text-lg mr-2">⚠️</Text>
        )}
        <View className="flex-1">
          <Text className={`text-error font-medium ${getSizeStyles()}`}>
            {message}
          </Text>
        </View>
        {onDismiss && (
          <Text 
            className="text-error text-lg ml-2"
            onPress={onDismiss}
          >
            ✕
          </Text>
        )}
      </View>
    </View>
  );
}
