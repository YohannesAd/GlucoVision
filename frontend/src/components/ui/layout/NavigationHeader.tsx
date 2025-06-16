import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * NavigationHeader - Header with title, back button, and optional right action
 *
 * Features:
 * - Title display
 * - Optional back button with custom handler
 * - Optional right action element
 * - Professional navigation styling
 * - Consistent spacing and typography
 *
 * Props:
 * - title: Header title text
 * - showBackButton: Whether to show back button
 * - onBackPress: Function to handle back button press
 * - rightAction: Optional right side action element
 */

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactElement;
}

export default function NavigationHeader({
  title,
  showBackButton = false,
  onBackPress,
  rightAction
}: NavigationHeaderProps) {
  return (
    <View className="bg-white px-6 py-4 border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        {/* Left side - Back button or spacer */}
        <View className="w-16">
          {showBackButton && onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              className="p-2 -ml-2"
              activeOpacity={0.7}
            >
              <Text className="text-darkBlue text-lg font-medium">← Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title */}
        <View className="flex-1">
          <Text className="text-xl font-bold text-darkBlue text-center">
            {title}
          </Text>
        </View>

        {/* Right side - Action or spacer */}
        <View className="w-16 items-end">
          {rightAction}
        </View>
      </View>
    </View>
  );
}
