import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { GlucoseLog } from '../../../types';
import {
  PDFReportData,
  calculateGlucoseStatistics,
  formatReportDate,
  formatDateRange,
  formatUserInfo,
  groupLogsByType
} from '../../../utils/pdfExportUtils';

/**
 * PDFReportGenerator Component
 * 
 * Professional PDF report layout component for glucose data
 * Generates a comprehensive report with app branding and user data
 * 
 * Features:
 * - App logo and branding header
 * - User information section
 * - Date range and generation info
 * - Glucose statistics summary
 * - Detailed readings table
 * - Professional formatting
 */

interface PDFReportGeneratorProps {
  reportData: PDFReportData;
  className?: string;
}

export default function PDFReportGenerator({
  reportData,
  className = ''
}: PDFReportGeneratorProps) {
  
  const { userInfo, dateRange, logs, glucoseUnit, generatedDate } = reportData;
  const statistics = calculateGlucoseStatistics(logs, glucoseUnit);
  const groupedLogs = groupLogsByType(logs);

  // Format reading type labels
  const formatReadingType = (type: string): string => {
    const typeMap: Record<string, string> = {
      'fasting': 'Fasting',
      'before_meal': 'Before Meal',
      'after_meal': 'After Meal',
      'bedtime': 'Bedtime',
      'random': 'Random',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  // Get glucose status color and label
  const getGlucoseStatus = (value: number) => {
    const targetMin = glucoseUnit === 'mg/dL' ? 70 : 3.9;
    const targetMax = glucoseUnit === 'mg/dL' ? 180 : 10.0;
    
    if (value < targetMin) return { status: 'Low', color: 'text-red-600' };
    if (value > targetMax) return { status: 'High', color: 'text-orange-600' };
    return { status: 'Normal', color: 'text-green-600' };
  };

  return (
    <ScrollView className={`bg-white ${className}`}>
      <View className="p-8">
        
        {/* Header Section */}
        <View className="items-center mb-8 border-b border-gray-200 pb-6">
          {/* App Logo and Name */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">G</Text>
            </View>
            <Text className="text-2xl font-bold text-darkBlue">GlucoVision</Text>
          </View>
          
          {/* Report Title */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Blood Glucose Summary Report
          </Text>
          
          {/* User Information Row */}
          <View className="flex-row justify-center items-center mb-2">
            <Text className="text-sm text-gray-600 text-center">
              {formatUserInfo(userInfo)}
            </Text>
          </View>
          
          {/* Generation Date */}
          <Text className="text-sm text-gray-500">
            Date Generated: {formatReportDate(generatedDate)}
          </Text>
        </View>

        {/* Report Period */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Report Period</Text>
          <Text className="text-gray-600">
            Date Range: {formatDateRange(dateRange)}
          </Text>
        </View>

        {/* Statistics Summary */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</Text>
          
          <View className="bg-gray-50 rounded-lg p-4">
            <View className="flex-row flex-wrap">
              {/* Total Readings */}
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-gray-500">Total Readings</Text>
                <Text className="text-xl font-bold text-darkBlue">{statistics.totalReadings}</Text>
              </View>
              
              {/* Average Glucose */}
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-gray-500">Average Glucose</Text>
                <Text className="text-xl font-bold text-darkBlue">
                  {statistics.averageGlucose} {glucoseUnit}
                </Text>
              </View>
              
              {/* Highest Reading */}
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-gray-500">Highest Reading</Text>
                <Text className="text-xl font-bold text-orange-600">
                  {statistics.highestReading} {glucoseUnit}
                </Text>
              </View>
              
              {/* Lowest Reading */}
              <View className="w-1/2 mb-4">
                <Text className="text-sm text-gray-500">Lowest Reading</Text>
                <Text className="text-xl font-bold text-blue-600">
                  {statistics.lowestReading} {glucoseUnit}
                </Text>
              </View>
              
              {/* Target Range */}
              <View className="w-full">
                <Text className="text-sm text-gray-500">In Target Range</Text>
                <Text className="text-xl font-bold text-green-600">
                  {statistics.targetRangePercentage}% ({statistics.readingsInRange}/{statistics.totalReadings})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Readings by Type */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Readings by Type</Text>
          
          {Object.entries(groupedLogs).map(([type, typeLogs]) => (
            <View key={type} className="mb-4">
              <Text className="text-md font-medium text-gray-700 mb-2">
                {formatReadingType(type)} ({typeLogs.length} readings)
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-3">
                {typeLogs.slice(0, 5).map((log, index) => {
                  const { status, color } = getGlucoseStatus(log.value);
                  return (
                    <View key={log.id} className="flex-row justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <View>
                        <Text className="text-sm font-medium text-gray-800">
                          {log.value} {glucoseUnit}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                      <Text className={`text-sm font-medium ${color}`}>
                        {status}
                      </Text>
                    </View>
                  );
                })}
                
                {typeLogs.length > 5 && (
                  <Text className="text-xs text-gray-500 mt-2 text-center">
                    ... and {typeLogs.length - 5} more readings
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View className="border-t border-gray-200 pt-6 mt-8">
          <Text className="text-xs text-gray-500 text-center">
            This report was generated by GlucoVision on {formatReportDate(generatedDate)}.
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            For medical advice, please consult with your healthcare provider.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
