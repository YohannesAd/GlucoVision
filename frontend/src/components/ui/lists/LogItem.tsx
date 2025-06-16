import React from 'react';
import { View, Text } from 'react-native';
import { GlucoseLog } from '../../../types';

/**
 * LogItem Component
 *
 * Individual glucose log item display
 * Used within LogsList component
 *
 * Features:
 * - Glucose value with unit
 * - Reading type and timestamp
 * - Color-coded status indicators
 * - Professional layout
 */

interface LogItemProps {
  log: GlucoseLog;
  showBorder?: boolean;
  glucoseUnit: string;
}

export default function LogItem({
  log,
  showBorder = true,
  glucoseUnit
}: LogItemProps) {

  // Get time ago string
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  // Get status based on glucose value
  const getGlucoseStatus = (value: number) => {
    if (value < 70) return 'low';
    if (value > 180) return 'high';
    return 'normal';
  };

  // Get status color based on glucose level
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'high': return 'bg-orange-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-orange-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const status = getGlucoseStatus(log.value);
  const formattedTime = getTimeAgo(log.timestamp);

  return (
    <View
      className={`flex-row items-center justify-between p-4 ${
        showBorder ? 'border-b border-gray-100' : ''
      }`}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status)}`} />
        <View>
          <Text className="text-gray-900 font-semibold">
            {log.value} {glucoseUnit}
          </Text>
          <Text className="text-gray-500 text-sm">
            {log.logType?.replace('_', ' ')} • {formattedTime}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`text-sm font-medium capitalize ${getStatusTextColor(status)}`}>
          {status}
        </Text>
        {log.notes && (
          <Text className="text-xs text-gray-400 mt-1">
            Note
          </Text>
        )}
      </View>
    </View>
  );
}
