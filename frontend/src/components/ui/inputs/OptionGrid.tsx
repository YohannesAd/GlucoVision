import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * OptionGrid - Reusable grid of selectable options
 * 
 * Features:
 * - Flexible grid layout
 * - Single or multiple selection
 * - Consistent styling
 * - Professional appearance
 */

interface Option {
  value: string;
  label: string;
}

interface OptionGridProps {
  label: string;
  subtitle?: string;
  options: Option[];
  selectedValue: string | boolean | null;
  onSelect: (value: string) => void;
  containerClassName?: string;
  columns?: 2 | 3 | 4;
}

export default function OptionGrid({
  label,
  subtitle,
  options,
  selectedValue,
  onSelect,
  containerClassName = 'mb-6',
  columns = 3,
}: OptionGridProps) {
  const getColumnWidth = () => {
    switch (columns) {
      case 2: return 'min-w-[45%]';
      case 3: return 'min-w-[30%]';
      case 4: return 'min-w-[22%]';
      default: return 'min-w-[30%]';
    }
  };

  return (
    <View className={containerClassName}>
      <Text className="text-textPrimary font-medium mb-3">{label}</Text>
      {subtitle && (
        <Text className="text-textSecondary text-sm mb-3">{subtitle}</Text>
      )}
      
      <View className="flex-row flex-wrap gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`flex-1 ${getColumnWidth()} py-3 px-3 rounded-xl border ${
              selectedValue === option.value
                ? 'bg-primary border-primary'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Text className={`text-center font-medium text-sm ${
              selectedValue === option.value ? 'text-white' : 'text-textPrimary'
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
