import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * PDFExportDateSelector Component
 * 
 * Professional date range selector for PDF export functionality
 * Allows users to select custom date ranges for their glucose reports
 * 
 * Features:
 * - Quick preset options (Last 7 days, Month, etc.)
 * - Custom date range selection
 * - Professional validation and feedback
 * - Clean, intuitive interface
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

type DatePreset = 'last7days' | 'last30days' | 'last3months';

interface PDFExportDateSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  className?: string;
}

export default function PDFExportDateSelector({
  selectedRange,
  onRangeChange,
  className = ''
}: PDFExportDateSelectorProps) {
  
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('last30days');

  // Preset options for quick selection
  const presetOptions = [
    { value: 'last7days' as DatePreset, label: 'Last 7 Days' },
    { value: 'last30days' as DatePreset, label: 'Last 30 Days' },
    { value: 'last3months' as DatePreset, label: 'Last 3 Months' },
  ];

  // Generate date range based on preset
  const getPresetDateRange = (preset: DatePreset): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    switch (preset) {
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);
        return { startDate: last7Days, endDate: today };
        
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);
        return { startDate: last30Days, endDate: today };
        
      case 'last3months':
        const last3Months = new Date(today);
        last3Months.setMonth(today.getMonth() - 3);
        last3Months.setHours(0, 0, 0, 0);
        return { startDate: last3Months, endDate: today };

      default:
        return selectedRange;
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset: DatePreset) => {
    setSelectedPreset(preset);
    const newRange = getPresetDateRange(preset);
    onRangeChange(newRange);
  };



  // Validate date range
  const isValidRange = selectedRange.startDate <= selectedRange.endDate;
  const daysDifference = Math.ceil((selectedRange.endDate.getTime() - selectedRange.startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      <Text className="text-lg font-bold text-darkBlue mb-4">Select Report Period</Text>
      
      {/* Preset Options */}
      <View className="mb-6">
        <Text className="text-textSecondary text-sm mb-3">Quick Options</Text>
        <View className="flex-row flex-wrap gap-2">
          {presetOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handlePresetSelect(option.value)}
              className={`px-4 py-2 rounded-lg border ${
                selectedPreset === option.value
                  ? 'bg-primary border-primary'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedPreset === option.value ? 'text-white' : 'text-darkBlue'
              }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>



      {/* Date Range Summary */}
      <View className="bg-blue-50 rounded-lg p-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm font-medium text-blue-900">
              Selected Period
            </Text>
            <Text className="text-xs text-blue-700 mt-1">
              {selectedRange.startDate.toLocaleDateString()} - {selectedRange.endDate.toLocaleDateString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-bold text-blue-900">
              {daysDifference} day{daysDifference !== 1 ? 's' : ''}
            </Text>
            {!isValidRange && (
              <Text className="text-xs text-red-600 mt-1">
                Invalid range
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Validation Message */}
      {!isValidRange && (
        <View className="mt-3 p-3 bg-red-50 rounded-lg">
          <Text className="text-sm text-red-700">
            End date must be after start date. Please adjust your selection.
          </Text>
        </View>
      )}
    </View>
  );
}
