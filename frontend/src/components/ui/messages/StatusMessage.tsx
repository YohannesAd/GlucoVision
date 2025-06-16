import React from 'react';
import { View, Text } from 'react-native';

/**
 * StatusMessage Component
 * 
 * Professional status display component for system status,
 * connection states, and informational messages
 * 
 * Used in:
 * - DashboardHeader (tracking status)
 * - Network connectivity (online/offline)
 * - Sync status (data synchronization)
 * - System notifications (app updates)
 * - Health status indicators
 */

interface StatusMessageProps {
  message: string;
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  variant?: 'dot' | 'badge' | 'banner' | 'inline';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

export default function StatusMessage({
  message,
  status,
  variant = 'inline',
  size = 'medium',
  showIcon = true,
  className = ''
}: StatusMessageProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          color: 'text-success',
          bgColor: 'bg-success',
          borderColor: 'border-success',
          icon: '●'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning',
          borderColor: 'border-warning',
          icon: '●'
        };
      case 'error':
        return {
          color: 'text-error',
          bgColor: 'bg-error',
          borderColor: 'border-error',
          icon: '●'
        };
      case 'info':
        return {
          color: 'text-info',
          bgColor: 'bg-info',
          borderColor: 'border-info',
          icon: '●'
        };
      case 'neutral':
      default:
        return {
          color: 'text-textSecondary',
          bgColor: 'bg-gray-400',
          borderColor: 'border-gray-400',
          icon: '●'
        };
    }
  };

  const getTextSize = () => {
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

  const getDotSize = () => {
    switch (size) {
      case 'small':
        return 'w-2 h-2';
      case 'large':
        return 'w-4 h-4';
      case 'medium':
      default:
        return 'w-3 h-3';
    }
  };

  const config = getStatusConfig();

  if (variant === 'dot') {
    return (
      <View className={`flex-row items-center ${className}`}>
        <View className={`${getDotSize()} ${config.bgColor} rounded-full mr-2`} />
        <Text className={`${config.color} ${getTextSize()}`}>
          {message}
        </Text>
      </View>
    );
  }

  if (variant === 'badge') {
    return (
      <View className={`flex-row items-center bg-gray-50 border ${config.borderColor} rounded-full px-3 py-1 ${className}`}>
        {showIcon && (
          <View className={`${getDotSize()} ${config.bgColor} rounded-full mr-2`} />
        )}
        <Text className={`${config.color} ${getTextSize()} font-medium`}>
          {message}
        </Text>
      </View>
    );
  }

  if (variant === 'banner') {
    const getBannerBg = () => {
      switch (status) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        case 'error':
          return 'bg-red-50 border-red-200';
        case 'info':
          return 'bg-blue-50 border-blue-200';
        case 'neutral':
        default:
          return 'bg-gray-50 border-gray-200';
      }
    };

    return (
      <View className={`${getBannerBg()} border rounded-lg p-3 ${className}`}>
        <View className="flex-row items-center">
          {showIcon && (
            <View className={`${getDotSize()} ${config.bgColor} rounded-full mr-3`} />
          )}
          <Text className={`${config.color} ${getTextSize()} flex-1`}>
            {message}
          </Text>
        </View>
      </View>
    );
  }

  // inline variant (default)
  return (
    <View className={`flex-row items-center ${className}`}>
      {showIcon && (
        <Text className={`${config.color} text-xs mr-2`}>
          {config.icon}
        </Text>
      )}
      <Text className={`${config.color} ${getTextSize()}`}>
        {message}
      </Text>
    </View>
  );
}
