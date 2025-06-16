import React from 'react';
import { View, Text } from 'react-native';

/**
 * SuccessMessage Component
 * 
 * Professional success display component used across screens
 * for confirmations, completed actions, and positive feedback
 * 
 * Used in:
 * - ResetPasswordSuccessScreen (password reset confirmation)
 * - AddLogScreen (glucose log saved)
 * - AccountScreen (profile updated)
 * - OnboardingScreens (step completed)
 * - Auth screens (account created, login success)
 */

interface SuccessMessageProps {
  message: string;
  variant?: 'inline' | 'card' | 'banner' | 'hero';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  icon?: string;
  onDismiss?: () => void;
  className?: string;
}

export default function SuccessMessage({
  message,
  variant = 'inline',
  size = 'medium',
  showIcon = true,
  icon = '✓',
  onDismiss,
  className = ''
}: SuccessMessageProps) {
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'bg-green-50 border border-green-200 rounded-lg p-4';
      case 'banner':
        return 'bg-green-50 border-l-4 border-green-400 p-4';
      case 'hero':
        return 'bg-green-50 border border-green-200 rounded-xl p-6 items-center';
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

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  if (variant === 'inline') {
    return (
      <Text className={`text-success ${getSizeStyles()} ${className}`}>
        {showIcon && `${icon} `}{message}
      </Text>
    );
  }

  if (variant === 'hero') {
    return (
      <View className={`${getVariantStyles()} ${className}`}>
        {showIcon && (
          <View className="w-16 h-16 bg-success rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl">{icon}</Text>
          </View>
        )}
        <Text className={`text-success font-semibold text-center ${getSizeStyles()}`}>
          {message}
        </Text>
        {onDismiss && (
          <Text 
            className="text-success text-lg mt-4"
            onPress={onDismiss}
          >
            ✕
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className={`${getVariantStyles()} ${className}`}>
      <View className="flex-row items-start">
        {showIcon && (
          <Text className={`text-success ${getIconSize()} mr-2`}>{icon}</Text>
        )}
        <View className="flex-1">
          <Text className={`text-success font-medium ${getSizeStyles()}`}>
            {message}
          </Text>
        </View>
        {onDismiss && (
          <Text 
            className="text-success text-lg ml-2"
            onPress={onDismiss}
          >
            ✕
          </Text>
        )}
      </View>
    </View>
  );
}
