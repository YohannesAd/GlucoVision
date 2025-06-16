import React from 'react';
import { View, Text } from 'react-native';

/**
 * EmptyState Component
 * 
 * Professional empty state display component used when no data is available
 * Provides clear messaging and optional actions for users
 * 
 * Used in:
 * - ViewLogsScreen (no glucose logs)
 * - AITrendsScreen (insufficient data)
 * - DashboardScreen (no recent readings)
 * - AccountScreen (no activity)
 * - Search results (no matches)
 */

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'illustration';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function EmptyState({
  title,
  message,
  icon = '📊',
  actionText,
  onAction,
  variant = 'default',
  size = 'medium',
  className = ''
}: EmptyStateProps) {
  
  const getContainerStyles = () => {
    const baseStyles = 'items-center justify-center';
    
    switch (variant) {
      case 'minimal':
        return `${baseStyles} py-8`;
      case 'illustration':
        return `${baseStyles} py-12 px-6`;
      case 'default':
      default:
        return `${baseStyles} py-10 px-4`;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'text-3xl';
      case 'large':
        return 'text-6xl';
      case 'medium':
      default:
        return 'text-4xl';
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'small':
        return 'text-base';
      case 'large':
        return 'text-xl';
      case 'medium':
      default:
        return 'text-lg';
    }
  };

  const getMessageSize = () => {
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

  const getSpacing = () => {
    switch (size) {
      case 'small':
        return { icon: 'mb-2', title: 'mb-1', message: 'mb-3' };
      case 'large':
        return { icon: 'mb-6', title: 'mb-3', message: 'mb-6' };
      case 'medium':
      default:
        return { icon: 'mb-4', title: 'mb-2', message: 'mb-4' };
    }
  };

  const spacing = getSpacing();

  if (variant === 'minimal') {
    return (
      <View className={`${getContainerStyles()} ${className}`}>
        <Text className={`text-textMuted ${getMessageSize()} text-center`}>
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View className={`${getContainerStyles()} ${className}`}>
      {/* Icon */}
      <Text className={`${getIconSize()} ${spacing.icon}`}>
        {icon}
      </Text>
      
      {/* Title */}
      <Text className={`text-textPrimary font-semibold ${getTitleSize()} text-center ${spacing.title}`}>
        {title}
      </Text>
      
      {/* Message */}
      <Text className={`text-textSecondary ${getMessageSize()} text-center max-w-xs ${spacing.message}`}>
        {message}
      </Text>
      
      {/* Action Button */}
      {actionText && onAction && (
        <View className="bg-primary rounded-lg px-6 py-3">
          <Text 
            className="text-white font-medium text-sm"
            onPress={onAction}
          >
            {actionText}
          </Text>
        </View>
      )}
    </View>
  );
}
