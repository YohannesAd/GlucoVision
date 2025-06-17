import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

/**
 * LogFilters Component
 *
 * Professional filter controls for glucose logs
 * Provides date range, meal context, value range, and sort order filtering
 *
 * Features:
 * - Date range filters (last 7 days, week, month)
 * - Reading type filters (fasting, after meal, random, bedtime, other)
 * - Value range filters (e.g., "Show all above 180 mg/dL")
 * - Sort order controls
 *
 * Used in:
 * - ViewLogsScreen (main filtering)
 * - AITrendsScreen (data filtering)
 * - DashboardScreen (recent logs filtering)
 */

type DateFilter = 'last7days' | 'week' | 'month' | 'all';
type MealFilter = 'all' | 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
type SortOrder = 'newest' | 'oldest';

interface ValueRange {
  min?: number;
  max?: number;
}

interface LogFiltersProps {
  dateFilter: DateFilter;
  mealFilter: MealFilter;
  sortOrder: SortOrder;
  valueRange: ValueRange;
  onDateFilterChange: (filter: DateFilter) => void;
  onMealFilterChange: (filter: MealFilter) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onValueRangeChange: (range: ValueRange) => void;
  className?: string;
}

export default function LogFilters({
  dateFilter,
  mealFilter,
  sortOrder,
  valueRange,
  onDateFilterChange,
  onMealFilterChange,
  onSortOrderChange,
  onValueRangeChange,
  className = ''
}: LogFiltersProps) {

  const [minValue, setMinValue] = useState(valueRange.min?.toString() || '');
  const [maxValue, setMaxValue] = useState(valueRange.max?.toString() || '');

  const dateFilterOptions = [
    { value: 'last7days' as DateFilter, label: 'Last 7 Days' },
    { value: 'week' as DateFilter, label: 'This Week' },
    { value: 'month' as DateFilter, label: 'This Month' },
    { value: 'all' as DateFilter, label: 'All Time' },
  ];

  const mealFilterOptions = [
    { value: 'all' as MealFilter, label: 'All Types' },
    { value: 'fasting' as MealFilter, label: 'Fasting' },
    { value: 'before_meal' as MealFilter, label: 'Before Meal' },
    { value: 'after_meal' as MealFilter, label: 'After Meal' },
    { value: 'bedtime' as MealFilter, label: 'Bedtime' },
    { value: 'random' as MealFilter, label: 'Random' },
  ];

  // Handle value range changes
  const handleValueRangeChange = () => {
    const min = minValue ? parseInt(minValue) : undefined;
    const max = maxValue ? parseInt(maxValue) : undefined;
    onValueRangeChange({ min, max });
  };

  return (
    <>
      <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
        <Text className="text-lg font-bold text-darkBlue mb-4">Smart Filters</Text>

        {/* Date Filter */}
        <View className="mb-4">
          <Text className="text-textSecondary text-sm mb-2">Date Range</Text>
          <View className="flex-row flex-wrap gap-2">
            {dateFilterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onDateFilterChange(option.value)}
                className={`px-3 py-2 rounded-lg border ${
                  dateFilter === option.value
                    ? 'bg-primary border-primary'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  dateFilter === option.value ? 'text-white' : 'text-darkBlue'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reading Type Filter */}
        <View className="mb-4">
          <Text className="text-textSecondary text-sm mb-2">Reading Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {mealFilterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => onMealFilterChange(option.value)}
                className={`px-3 py-2 rounded-lg border ${
                  mealFilter === option.value
                    ? 'bg-primary border-primary'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  mealFilter === option.value ? 'text-white' : 'text-darkBlue'
                }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Value Range Filter */}
        <View className="mb-4">
          <Text className="text-textSecondary text-sm mb-2">Glucose Value Range (mg/dL)</Text>
          <View className="flex-row gap-3 items-center">
            <View className="flex-1">
              <TextInput
                placeholder="Min (e.g., 70)"
                value={minValue}
                onChangeText={setMinValue}
                onBlur={handleValueRangeChange}
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-darkBlue"
              />
            </View>
            <Text className="text-gray-400">to</Text>
            <View className="flex-1">
              <TextInput
                placeholder="Max (e.g., 180)"
                value={maxValue}
                onChangeText={setMaxValue}
                onBlur={handleValueRangeChange}
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-darkBlue"
              />
            </View>
          </View>
          {(valueRange.min || valueRange.max) && (
            <Text className="text-xs text-gray-500 mt-2">
              Showing readings {valueRange.min ? `above ${valueRange.min}` : ''}
              {valueRange.min && valueRange.max ? ' and ' : ''}
              {valueRange.max ? `below ${valueRange.max}` : ''} mg/dL
            </Text>
          )}
        </View>

        {/* Sort Order */}
        <View>
          <Text className="text-textSecondary text-sm mb-2">Sort Order</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => onSortOrderChange('newest')}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                sortOrder === 'newest'
                  ? 'bg-primary border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                sortOrder === 'newest' ? 'text-white' : 'text-darkBlue'
              }`}>
                Newest First
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSortOrderChange('oldest')}
              className={`flex-1 px-3 py-2 rounded-lg border ${
                sortOrder === 'oldest'
                  ? 'bg-primary border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium text-center ${
                sortOrder === 'oldest' ? 'text-white' : 'text-darkBlue'
              }`}>
                Oldest First
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
