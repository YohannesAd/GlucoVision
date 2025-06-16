import React from 'react';
import { View, Text } from 'react-native';

/**
 * FeatureItem - Reusable component for displaying features with icons
 *
 * Used for:
 * - Landing page feature highlights
 * - Feature lists in onboarding
 * - Any icon + text combination
 */

interface FeatureItemProps {
  icon: string;
  text: string;
  iconBackgroundColor?: string;
  containerClassName?: string;
  iconContainerClassName?: string;
  textClassName?: string;
}

export default function FeatureItem({
  icon,
  text,
  iconBackgroundColor = 'bg-primary',
  containerClassName = 'flex-row items-center bg-white/50 rounded-xl p-4 mb-3',
  iconContainerClassName = 'w-10 h-10 rounded-full items-center justify-center mr-4',
  textClassName = 'flex-1 text-gray-800 font-medium text-base',
}: FeatureItemProps) {
  return (
    <View className={containerClassName}>
      {/* Feature Icon */}
      <View className={`${iconContainerClassName} ${iconBackgroundColor}`}>
        <Text className="text-white font-bold text-sm">{icon}</Text>
      </View>

      {/* Feature Text */}
      <Text className={textClassName}>
        {text}
      </Text>
    </View>
  );
}
