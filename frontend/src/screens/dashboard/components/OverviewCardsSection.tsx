import React from 'react';
import { View, Text } from 'react-native';

/**
 * OverviewCardsSection - Today's glucose overview with visual indicators
 * 
 * Features:
 * - Latest reading with status indicator
 * - Daily average with trend comparison
 * - Weekly trend analysis with progress bar
 * - Professional card layout with proper spacing
 * - Structured for backend data integration
 * 
 * Props:
 * - glucoseData: Object containing latest reading, averages, and trends
 */

interface GlucoseData {
  latestReading: {
    value: number;
    timestamp: string;
    status: 'normal' | 'high' | 'low';
  };
  todayAverage: number;
  todayReadingsCount: number;
  weeklyTrend: {
    direction: 'improving' | 'stable' | 'declining';
    percentage: number;
    timeInRange: number;
  };
}

interface OverviewCardsSectionProps {
  glucoseData?: GlucoseData;
}

export default function OverviewCardsSection({ glucoseData }: OverviewCardsSectionProps) {
  // Default mock data - will be replaced with real data from props
  const defaultData: GlucoseData = {
    latestReading: { value: 125, timestamp: '2 hours ago', status: 'normal' },
    todayAverage: 118,
    todayReadingsCount: 3,
    weeklyTrend: {
      direction: 'improving',
      percentage: 8,
      timeInRange: 75
    }
  };

  const data = glucoseData || defaultData;

  // Get status color based on glucose level
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success';
      case 'high': return 'bg-warning';
      case 'low': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-success';
      case 'high': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-gray-500';
    }
  };

  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-bold text-darkBlue mb-4">Today's Overview</Text>
      
      <View className="flex-row space-x-3 mb-4">
        {/* Latest Reading Card */}
        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-2">
            Latest Reading
          </Text>
          <Text className="text-2xl font-bold text-darkBlue">
            {data.latestReading.value}
          </Text>
          <Text className="text-textSecondary text-xs">
            mg/dL • {data.latestReading.timestamp}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(data.latestReading.status)}`} />
            <Text className={`text-xs font-medium capitalize ${getStatusTextColor(data.latestReading.status)}`}>
              {data.latestReading.status}
            </Text>
          </View>
        </View>

        {/* Daily Average Card */}
        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-2">
            Today's Average
          </Text>
          <Text className="text-2xl font-bold text-darkBlue">
            {data.todayAverage}
          </Text>
          <Text className="text-textSecondary text-xs">
            mg/dL • {data.todayReadingsCount} readings
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className="text-primary text-xs font-medium">
              ↗ +{data.weeklyTrend.percentage}% vs yesterday
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Trend Card */}
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <Text className="text-textSecondary text-xs uppercase tracking-wide mb-2">
          Weekly Trend Analysis
        </Text>
        <Text className="text-lg font-bold text-darkBlue mb-2">
          Glucose Control {data.weeklyTrend.direction === 'improving' ? 'Improving' : 
                          data.weeklyTrend.direction === 'stable' ? 'Stable' : 'Needs Attention'}
        </Text>
        <Text className="text-textSecondary text-sm mb-3">
          Your average glucose has {data.weeklyTrend.direction === 'improving' ? 'decreased' : 'changed'} by {data.weeklyTrend.percentage}% this week. 
          {data.weeklyTrend.direction === 'improving' ? ' Great progress!' : ''}
        </Text>
        <View className="flex-row items-center">
          <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
            <View 
              className="bg-success h-2 rounded-full" 
              style={{ width: `${data.weeklyTrend.timeInRange}%` }} 
            />
          </View>
          <Text className="text-success text-sm font-medium">
            {data.weeklyTrend.timeInRange}% in range
          </Text>
        </View>
      </View>
    </View>
  );
}
