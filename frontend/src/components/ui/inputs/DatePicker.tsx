import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

/**
 * DatePicker - Reusable date picker component for onboarding
 * 
 * Features:
 * - Month, day, year selection
 * - Modal-based interface
 * - Professional styling
 * - Formatted display
 */

interface DatePickerProps {
  label: string;
  subtitle?: string;
  value: { day: string; month: string; year: string };
  onSelect: (day: string, month: string, year: string) => void;
  containerClassName?: string;
}

export default function DatePicker({
  label,
  subtitle,
  value,
  onSelect,
  containerClassName = 'mb-6',
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Generate options
  const generateDayOptions = () => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      days.push(day);
    }
    return days;
  };

  const generateMonthOptions = () => {
    return [
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ];
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 10; year >= 1920; year--) {
      years.push(year);
    }
    return years;
  };

  const getDisplayValue = () => {
    if (value.day && value.month && value.year) {
      const monthName = generateMonthOptions().find(m => m.value === value.month)?.label;
      return `${monthName} ${value.day}, ${value.year}`;
    }
    return 'Select Date of Birth';
  };

  return (
    <View className={containerClassName}>
      <Text className="text-textPrimary font-medium mb-2">{label}</Text>
      {subtitle && (
        <Text className="text-textSecondary text-sm mb-3">{subtitle}</Text>
      )}

      <TouchableOpacity
        className="bg-white border border-gray-200 rounded-xl px-4 py-3"
        onPress={() => setShowPicker(true)}
      >
        <Text className="text-textPrimary font-medium">
          {getDisplayValue()}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-textPrimary">{label}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text className="text-primary font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-textPrimary font-medium mb-2">Month</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {generateMonthOptions().map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    className={`py-2 px-3 rounded-lg border ${
                      value.month === month.value ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => onSelect(value.day, month.value, value.year)}
                  >
                    <Text className={`text-xs font-medium ${
                      value.month === month.value ? 'text-white' : 'text-textPrimary'
                    }`}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-textPrimary font-medium mb-2">Day</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {generateDayOptions().map((day) => (
                  <TouchableOpacity
                    key={day}
                    className={`py-2 px-3 rounded-lg border min-w-[40px] ${
                      value.day === day.toString() ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => onSelect(day.toString(), value.month, value.year)}
                  >
                    <Text className={`text-xs font-medium text-center ${
                      value.day === day.toString() ? 'text-white' : 'text-textPrimary'
                    }`}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-textPrimary font-medium mb-2">Year</Text>
              <View className="flex-row flex-wrap gap-2">
                {generateYearOptions().map((year) => (
                  <TouchableOpacity
                    key={year}
                    className={`py-2 px-3 rounded-lg border ${
                      value.year === year.toString() ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-200'
                    }`}
                    onPress={() => onSelect(value.day, value.month, year.toString())}
                  >
                    <Text className={`text-xs font-medium ${
                      value.year === year.toString() ? 'text-white' : 'text-textPrimary'
                    }`}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
