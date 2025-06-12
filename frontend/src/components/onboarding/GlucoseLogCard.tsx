import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * GlucoseLogCard - Reusable glucose log entry component
 * 
 * Features:
 * - Clean card layout
 * - Value and time selection
 * - Professional styling
 * - Consistent structure
 */

interface GlucoseLogCardProps {
  logNumber: number;
  value: string;
  timeOfDay: string;
  onValuePress: () => void;
  onTimeSelect: (time: string) => void;
}

const timeOfDayOptions = [
  { value: 'Fasting', label: 'Fasting' },
  { value: 'Before Meal', label: 'Before Meal' },
  { value: 'After Meal', label: 'After Meal' },
  { value: 'Bedtime', label: 'Bedtime' },
];

export default function GlucoseLogCard({
  logNumber,
  value,
  timeOfDay,
  onValuePress,
  onTimeSelect,
}: GlucoseLogCardProps) {
  return (
    <View className="mb-5 p-4 bg-gray-50 rounded-xl">
      <Text className="text-textPrimary font-semibold mb-3 text-center">
        Log {logNumber} *
      </Text>

      {/* Glucose Value */}
      <View className="mb-3">
        <Text className="text-textPrimary font-medium mb-2">Value (mg/dL)</Text>
        <TouchableOpacity
          className="bg-white border border-gray-200 rounded-xl px-4 py-3"
          onPress={onValuePress}
        >
          <Text className="text-textPrimary font-medium">
            {value ? `${value} mg/dL` : 'Select glucose value'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time of Day */}
      <View>
        <Text className="text-textSecondary text-sm mb-2">Time of Day</Text>
        <View className="flex-row flex-wrap gap-2">
          {timeOfDayOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onTimeSelect(option.value)}
              className={`flex-1 min-w-[22%] py-2 px-2 rounded-lg border ${
                timeOfDay === option.value
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-xs font-medium text-center ${
                timeOfDay === option.value ? 'text-white' : 'text-textPrimary'
              }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
