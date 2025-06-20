import React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ScreenContainer - Consistent wrapper for all screens
 *
 * Provides:
 * - SafeAreaView with consistent styling
 * - StatusBar configuration
 * - Customizable background colors
 */

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: StatusBarStyle;
  statusBarBackgroundColor?: string;
}

function ScreenContainer({
  children,
  backgroundColor = 'bg-white',
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = '#FFFFFF',
}: ScreenContainerProps) {
  // Ensure children is valid
  if (!children) {
    console.warn('ScreenContainer: No children provided');
    return null;
  }

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor || 'bg-white'}`}>
      <StatusBar
        barStyle={statusBarStyle || 'dark-content'}
        backgroundColor={statusBarBackgroundColor || '#FFFFFF'}
      />
      {children}
    </SafeAreaView>
  );
}

// Add displayName for debugging
ScreenContainer.displayName = 'ScreenContainer';

export default ScreenContainer;
