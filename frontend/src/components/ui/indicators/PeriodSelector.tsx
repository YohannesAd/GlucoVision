import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * PeriodSelector - Reusable component for time period selection
 * Used in AI Trends, Reports, and other analytics screens
 */

type Period = 'week' | 'month' | 'quarter';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  periods?: Period[];
  title?: string;
  disabled?: boolean;
  className?: string;
}

export default function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  periods = ['week', 'month', 'quarter'],
  title = 'Analysis Period',
  disabled = false,
  className = ''
}: PeriodSelectorProps) {
  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <Text className="text-lg font-bold text-darkBlue mb-4">{title}</Text>
      <View className="flex-row gap-3">
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            onPress={() => !disabled && onPeriodChange(period)}
            disabled={disabled}
            className={`flex-1 py-3 px-4 rounded-lg border ${
              selectedPeriod === period
                ? 'bg-primary border-primary'
                : 'bg-gray-50 border-gray-200'
            } ${disabled ? 'opacity-50' : ''}`}
          >
            <Text className={`text-center font-medium capitalize ${
              selectedPeriod === period ? 'text-white' : 'text-darkBlue'
            }`}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
