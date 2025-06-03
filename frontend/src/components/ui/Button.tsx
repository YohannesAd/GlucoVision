import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-xl items-center justify-center';

    // Size classes
    const sizeClasses = {
      small: 'py-2 px-4',
      medium: 'py-3 px-6',
      large: 'py-4 px-8',
    };

    // Variant classes
    const variantClasses = {
      primary: disabled ? 'bg-gray-300' : 'bg-primary',
      secondary: disabled ? 'bg-gray-200' : 'bg-secondary',
      outline: disabled ? 'border border-gray-300' : 'border border-primary',
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-semibold text-center';

    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

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
