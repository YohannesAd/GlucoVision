import React from 'react';
import { View, Text } from 'react-native';

/**
 * TrendIndicator - Reusable component for showing trends with arrows and colors
 * Used in Dashboard, AI Trends, and analytics screens
 */

type TrendDirection = 'improving' | 'declining' | 'stable';

interface TrendIndicatorProps {
  direction: TrendDirection;
  percentage: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  className?: string;
}

export default function TrendIndicator({
  direction,
  percentage,
  label,
  size = 'medium',
  showPercentage = true,
  className = ''
}: TrendIndicatorProps) {
  // Get trend arrow and color
  const getTrendDisplay = () => {
    switch (direction) {
      case 'improving':
        return {
          arrow: '↗',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'declining':
        return {
          arrow: '↘',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          arrow: '→',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          arrow: 'text-sm',
          percentage: 'text-sm',
          label: 'text-xs'
        };
      case 'large':
        return {
          container: 'px-4 py-3',
          arrow: 'text-2xl',
          percentage: 'text-2xl',
          label: 'text-sm'
        };
      default:
        return {
          container: 'px-3 py-2',
          arrow: 'text-lg',
          percentage: 'text-lg',
          label: 'text-xs'
        };
    }
  };

  const trendDisplay = getTrendDisplay();
  const sizeClasses = getSizeClasses();

  return (
    <View className={`items-center ${className}`}>
      <View className={`
        flex-row items-center rounded-lg border
        ${trendDisplay.bgColor} ${trendDisplay.borderColor}
        ${sizeClasses.container}
      `}>
        <Text className={`${trendDisplay.color} ${sizeClasses.arrow} font-bold mr-1`}>
          {trendDisplay.arrow}
        </Text>
        {showPercentage && (
          <Text className={`${trendDisplay.color} ${sizeClasses.percentage} font-bold`}>
            {Math.abs(percentage)}%
          </Text>
        )}
      </View>
      {label && (
        <Text className={`${sizeClasses.label} text-textSecondary mt-1 text-center`}>
          {label}
        </Text>
      )}
    </View>
  );
}
