import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

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
    <View className={containerClassName} style={[styles.container]}>
      {/* Feature Icon */}
      <View className={`${iconContainerClassName} ${iconBackgroundColor}`} style={[styles.iconContainer]}>
        <Text className="text-white font-bold text-sm" style={[styles.iconText]}>
          {icon}
        </Text>
      </View>

      {/* Feature Text */}
      <Text className={textClassName} style={[styles.featureText]}>
        {text}
      </Text>
    </View>
  );
}

// Fallback styles for web compatibility
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  featureText: {
    flex: 1,
    color: '#1F2937',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
  },
});
