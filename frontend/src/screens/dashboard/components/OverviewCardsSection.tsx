import React from 'react';
import { View, Text } from 'react-native';
import { TodayStats, WeeklyTrend } from '../../../services/dashboard/dashboardService';

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

interface OverviewCardsSectionProps {
  todayStats?: TodayStats;
  weeklyTrend?: WeeklyTrend;
}

export default function OverviewCardsSection({ todayStats, weeklyTrend }: OverviewCardsSectionProps) {
  // Default mock data - will be replaced with real data from props
  const defaultTodayStats: TodayStats = {
    average: 118,
    readingsCount: 3,
    latestReading: {
      id: '1',
      value: 125,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      timeOfDay: 'after_meal',
      status: 'normal'
    },
    timeInRange: 75
  };

  const defaultWeeklyTrend: WeeklyTrend = {
    direction: 'improving',
    percentage: 8,
    averageChange: -5
  };

  const stats = todayStats || defaultTodayStats;
  const trend = weeklyTrend || defaultWeeklyTrend;

  // Get status color based on glucose level
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-success';
      case 'high': return 'bg-warning';
      case 'low': return 'bg-error';
      default: return 'bg-gray-400';
    }
  };

  // Get time ago string
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
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
            {stats.latestReading?.value || '--'}
          </Text>
          <Text className="text-textSecondary text-xs">
            mg/dL • {stats.latestReading ? getTimeAgo(stats.latestReading.timestamp) : 'No data'}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(stats.latestReading?.status || 'normal')}`} />
            <Text className="text-success text-xs font-medium">
              {stats.timeInRange}% in range
            </Text>
          </View>
        </View>

        {/* Daily Average Card */}
        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-2">
            Today's Average
          </Text>
          <Text className="text-2xl font-bold text-darkBlue">
            {stats.average}
          </Text>
          <Text className="text-textSecondary text-xs">
            mg/dL • {stats.readingsCount} readings
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className={`text-xs font-medium ${trend.direction === 'improving' ? 'text-success' : trend.direction === 'declining' ? 'text-error' : 'text-textSecondary'}`}>
              {trend.direction === 'improving' ? '↗' : trend.direction === 'declining' ? '↘' : '→'} {Math.abs(trend.percentage)}% vs last week
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
          Glucose Control {trend.direction === 'improving' ? 'Improving' :
                          trend.direction === 'stable' ? 'Stable' : 'Needs Attention'}
        </Text>
        <Text className="text-textSecondary text-sm mb-3">
          Your average glucose has {trend.direction === 'improving' ? 'decreased' : 'changed'} by {Math.abs(trend.percentage)}% this week.
          {trend.direction === 'improving' ? ' Great progress!' : ''}
        </Text>
        <View className="flex-row items-center">
          <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
            <View
              className="bg-success h-2 rounded-full"
              style={{ width: `${stats.timeInRange}%` }}
            />
          </View>
          <Text className="text-success text-sm font-medium">
            {stats.timeInRange}% in range
          </Text>
        </View>
      </View>
    </View>
  );
}
