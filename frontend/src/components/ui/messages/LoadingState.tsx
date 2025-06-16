import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

/**
 * LoadingState Component
 * 
 * Professional loading display component used across screens
 * for API calls, data fetching, and processing states
 * 
 * Used in:
 * - RootNavigator (auth state loading)
 * - All API calls (data fetching)
 * - Form submissions (processing)
 * - Chart loading (data visualization)
 * - Export operations (file generation)
 */

interface LoadingStateProps {
  message?: string;
  variant?: 'inline' | 'overlay' | 'card' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showMessage?: boolean;
  className?: string;
}

export default function LoadingState({
  message = 'Loading...',
  variant = 'inline',
  size = 'medium',
  color = '#007AFF',
  showMessage = true,
  className = ''
}: LoadingStateProps) {
  
  const getIndicatorSize = () => {
    switch (size) {
      case 'small':
        return 'small' as const;
      case 'large':
        return 'large' as const;
      case 'medium':
      default:
        return 'small' as const;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-lg';
      case 'medium':
      default:
        return 'text-sm';
    }
  };

  const getSpacing = () => {
    switch (size) {
      case 'small':
        return 'mb-1';
      case 'large':
        return 'mb-4';
      case 'medium':
      default:
        return 'mb-2';
    }
  };

  if (variant === 'minimal') {
    return (
      <ActivityIndicator 
        size={getIndicatorSize()} 
        color={color} 
        className={className}
      />
    );
  }

  if (variant === 'overlay') {
    return (
      <View className={`absolute inset-0 bg-black bg-opacity-50 items-center justify-center z-50 ${className}`}>
        <View className="bg-white rounded-lg p-6 items-center">
          <ActivityIndicator 
            size={getIndicatorSize()} 
            color={color} 
            className={getSpacing()}
          />
          {showMessage && (
            <Text className={`text-textPrimary ${getTextSize()}`}>
              {message}
            </Text>
          )}
        </View>
      </View>
    );
  }

  if (variant === 'card') {
    return (
      <View className={`bg-white border border-gray-200 rounded-lg p-6 items-center ${className}`}>
        <ActivityIndicator 
          size={getIndicatorSize()} 
          color={color} 
          className={getSpacing()}
        />
        {showMessage && (
          <Text className={`text-textSecondary ${getTextSize()}`}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  // inline variant (default)
  return (
    <View className={`flex-row items-center ${className}`}>
      <ActivityIndicator 
        size={getIndicatorSize()} 
        color={color} 
        className="mr-2"
      />
      {showMessage && (
        <Text className={`text-textSecondary ${getTextSize()}`}>
          {message}
        </Text>
      )}
    </View>
  );
}
