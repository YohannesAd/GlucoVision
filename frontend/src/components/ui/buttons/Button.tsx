import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

/**
 * Button - Reusable button component with multiple variants and sizes
 *
 * Features:
 * - Multiple variants: primary, secondary, outline
 * - Multiple sizes: small, medium, large
 * - Disabled state handling
 * - Consistent styling across the app
 * - Custom style overrides support
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  className = '',
}: ButtonProps) {
  // Generate button container classes based on variant and size
  const getButtonClasses = () => {
    const baseClasses = 'rounded-xl items-center justify-center';

    // Size-based padding
    const sizeClasses = {
      small: 'py-2 px-4',
      medium: 'py-3 px-6',
      large: 'py-4 px-8',
    };

    // Variant-based colors and borders
    const variantClasses = {
      primary: disabled ? 'bg-gray-300' : 'bg-primary',
      secondary: disabled ? 'bg-gray-200' : 'bg-secondary',
      outline: disabled ? 'border border-gray-300' : 'border border-primary',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  // Generate text classes based on variant and size
  const getTextClasses = () => {
    const baseClasses = 'font-semibold text-center';

    // Size-based font sizes
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    // Variant-based text colors
    const variantClasses = {
      primary: disabled ? 'text-gray-500' : 'text-white',
      secondary: disabled ? 'text-gray-500' : 'text-white',
      outline: disabled ? 'text-gray-400' : 'text-primary',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled}
      style={style}
      activeOpacity={0.8}
    >
      <Text className={getTextClasses()} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
