import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * NavigationLink - Reusable question + action link pattern
 *
 * Common pattern for:
 * - "Don't have an account? Sign Up"
 * - "Already have an account? Sign In"
 * - Other navigation prompts
 */

interface NavigationLinkProps {
  questionText: string;
  actionText: string;
  onPress: () => void;
  containerClassName?: string;
  questionTextClassName?: string;
  actionTextClassName?: string;
}

export default function NavigationLink({
  questionText,
  actionText,
  onPress,
  containerClassName = 'flex-row justify-center items-center',
  questionTextClassName = 'text-textSecondary',
  actionTextClassName = 'text-primary font-semibold',
}: NavigationLinkProps) {
  return (
    <View className={containerClassName}>
      {/* Question Text */}
      <Text className={questionTextClassName}>
        {questionText}
      </Text>

      {/* Action Link */}
      <TouchableOpacity onPress={onPress} className="ml-1">
        <Text className={actionTextClassName}>
          {actionText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
