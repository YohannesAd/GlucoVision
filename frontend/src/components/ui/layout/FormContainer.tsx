import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';

/**
 * FormContainer - Wrapper for form screens with keyboard handling
 *
 * Features:
 * - Automatic keyboard avoidance
 * - Platform-specific behavior (iOS/Android)
 * - Consistent form layout and spacing
 * - Prevents content overlap when keyboard appears
 */

interface FormContainerProps {
  children: React.ReactNode;
  containerClassName?: string;
  contentClassName?: string;
}

export default function FormContainer({
  children,
  containerClassName = 'flex-1',
  contentClassName = 'flex-1 justify-center px-6 py-8',
}: FormContainerProps) {
  return (
    <KeyboardAvoidingView
      className={containerClassName}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className={contentClassName}>
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}

// Add displayName for debugging
FormContainer.displayName = 'FormContainer';
