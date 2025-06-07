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

export default function ScreenContainer({
  children,
  backgroundColor = 'bg-white',
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = '#FFFFFF',
}: ScreenContainerProps) {
  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarBackgroundColor} />
      {children}
    </SafeAreaView>
  );
}
