import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

/**
 * QuickActionButton - Reusable component for action buttons
 * Used in Dashboard, Quick Actions, and other interactive screens
 */

interface QuickActionButtonProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function QuickActionButton({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = ''
}: QuickActionButtonProps) {
  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-100 border-gray-200';
      case 'outline':
        return 'bg-white border-primary border-2';
      case 'ghost':
        return 'bg-transparent border-transparent';
      default:
        return 'bg-primary border-primary';
    }
  };

  // Get text color classes
  const getTextColorClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-darkBlue';
      case 'outline':
        return 'text-primary';
      case 'ghost':
        return 'text-darkBlue';
      default:
        return 'text-white';
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'py-2 px-3',
          title: 'text-sm',
          subtitle: 'text-xs',
          icon: 'text-lg'
        };
      case 'large':
        return {
          container: 'py-4 px-6',
          title: 'text-lg',
          subtitle: 'text-sm',
          icon: 'text-2xl'
        };
      default:
        return {
          container: 'py-3 px-4',
          title: 'text-base',
          subtitle: 'text-sm',
          icon: 'text-xl'
        };
    }
  };

  const variantClasses = getVariantClasses();
  const textColorClasses = getTextColorClasses();
  const sizeClasses = getSizeClasses();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        ${variantClasses}
        ${sizeClasses.container}
        ${fullWidth ? 'flex-1' : ''}
        ${disabled ? 'opacity-50' : ''}
        rounded-xl border shadow-sm
        ${className}
      `}
    >
      <View className="items-center">
        {icon && (
          <Text className={`${sizeClasses.icon} mb-2`}>{icon}</Text>
        )}
        <Text className={`${sizeClasses.title} font-semibold ${textColorClasses} text-center`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`${sizeClasses.subtitle} ${textColorClasses} opacity-80 text-center mt-1`}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
