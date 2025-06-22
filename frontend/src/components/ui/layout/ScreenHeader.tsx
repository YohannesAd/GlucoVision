import React from 'react';
import { View, Text } from 'react-native';

/**
 * ScreenHeader - Consistent header component for all screens
 *
 * Features:
 * - Standard title + subtitle pattern
 * - Consistent typography and spacing
 * - Optional subtitle support
 * - Customizable styling
 */

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function ScreenHeader({
  title,
  subtitle,
  containerClassName = 'items-center mb-8',
  titleClassName = 'text-3xl font-bold text-darkBlue mb-2',
  subtitleClassName = 'text-textSecondary text-base text-center',
}: ScreenHeaderProps) {
  return (
    <View className={containerClassName}>
      {/* Main Title */}
      <Text className={titleClassName}>{title}</Text>

      {/* Optional Subtitle */}
      {subtitle && (
        <Text className={subtitleClassName}>{subtitle}</Text>
      )}
    </View>
  );
}

// Add displayName for debugging
ScreenHeader.displayName = 'ScreenHeader';
