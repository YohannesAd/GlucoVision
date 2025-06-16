import React from 'react';
import { View, Text } from 'react-native';

/**
 * StatsCard - Reusable component for displaying statistics
 * Used across Dashboard, AI Trends, and other screens
 */

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'primary' | 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  size = 'medium',
  className = ''
}: StatsCardProps) {
  // Get color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      case 'blue':
        return 'text-blue-600';
      case 'gray':
        return 'text-gray-600';
      default:
        return 'text-darkBlue';
    }
  };

  // Get size classes based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          value: 'text-lg font-bold',
          title: 'text-xs',
          subtitle: 'text-xs',
          padding: 'p-3'
        };
      case 'large':
        return {
          value: 'text-3xl font-bold',
          title: 'text-sm',
          subtitle: 'text-sm',
          padding: 'p-6'
        };
      default:
        return {
          value: 'text-2xl font-bold',
          title: 'text-xs',
          subtitle: 'text-xs',
          padding: 'p-4'
        };
    }
  };

  const colorClasses = getColorClasses();
  const sizeClasses = getSizeClasses();

  return (
    <View className={`items-center ${sizeClasses.padding} ${className}`}>
      {icon && (
        <Text className="text-lg mb-1">{icon}</Text>
      )}
      <Text className={`${sizeClasses.value} ${colorClasses}`}>
        {value}
      </Text>
      <Text className={`${sizeClasses.title} text-textSecondary text-center`}>
        {title}
      </Text>
      {subtitle && (
        <Text className={`${sizeClasses.subtitle} text-gray-500 text-center mt-1`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
