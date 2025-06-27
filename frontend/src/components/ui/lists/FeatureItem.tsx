import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
}: FeatureItemProps) {
  // Get background color based on prop
  const getIconBackgroundColor = () => {
    switch (iconBackgroundColor) {
      case 'bg-primary':
        return '#007AFF';
      case 'bg-secondary':
        return '#34C759';
      case 'bg-accent':
        return '#FF9500';
      default:
        return '#007AFF';
    }
  };

  return (
    <View style={styles.container}>
      {/* Feature Icon */}
      <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Feature Text */}
      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

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
