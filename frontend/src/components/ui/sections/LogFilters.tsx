import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * LogFilters Component
 * 
 * Professional filter controls for glucose logs
 * Provides date range, meal context, and sort order filtering
 * 
 * Used in:
 * - ViewLogsScreen (main filtering)
 * - AITrendsScreen (data filtering)
 * - DashboardScreen (recent logs filtering)
 */

type DateFilter = 'today' | 'week' | 'month' | 'all';
type MealFilter = 'all' | 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
type SortOrder = 'newest' | 'oldest';

interface LogFiltersProps {
  dateFilter: DateFilter;
  mealFilter: MealFilter;
  sortOrder: SortOrder;
  onDateFilterChange: (filter: DateFilter) => void;
  onMealFilterChange: (filter: MealFilter) => void;
  onSortOrderChange: (order: SortOrder) => void;
  className?: string;
}

export default function LogFilters({
  dateFilter,
  mealFilter,
  sortOrder,
  onDateFilterChange,
  onMealFilterChange,
  onSortOrderChange,
  className = ''
}: LogFiltersProps) {
  
  const dateFilterOptions = [
    { value: 'today' as DateFilter, label: 'Today' },
    { value: 'week' as DateFilter, label: 'This Week' },
    { value: 'month' as DateFilter, label: 'This Month' },
    { value: 'all' as DateFilter, label: 'All Time' },
  ];

  const mealFilterOptions = [
    { value: 'all' as MealFilter, label: 'All' },
    { value: 'fasting' as MealFilter, label: 'Fasting' },
    { value: 'before_meal' as MealFilter, label: 'Before Meal' },
    { value: 'after_meal' as MealFilter, label: 'After Meal' },
    { value: 'bedtime' as MealFilter, label: 'Bedtime' },
    { value: 'random' as MealFilter, label: 'Random' },
  ];

  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <Text className="text-lg font-bold text-darkBlue mb-4">Filters</Text>
      
      {/* Date Filter */}
      <View className="mb-4">
        <Text className="text-textSecondary text-sm mb-2">Time Period</Text>
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

      {/* Meal Context Filter */}
      <View className="mb-4">
        <Text className="text-textSecondary text-sm mb-2">Meal Context</Text>
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
  );
}
