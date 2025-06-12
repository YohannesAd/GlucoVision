import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from '../../../components/ui';

/**
 * RecentReadingsSection - Display recent glucose readings with navigation
 * 
 * Features:
 * - Last few glucose readings with timestamps
 * - Color-coded status indicators
 * - "View All" navigation link
 * - "Add New Reading" button
 * - Professional list layout
 * - Structured for backend data integration
 * 
 * Props:
 * - recentReadings: Array of recent glucose readings
 * - onViewAll: Function to handle "View All" navigation
 * - onAddReading: Function to handle "Add Reading" action
 */

interface GlucoseReading {
  id: string;
  value: number;
  time: string;
  status: 'normal' | 'high' | 'low';
}

interface RecentReadingsSectionProps {
  recentReadings?: GlucoseReading[];
  onViewAll?: () => void;
  onAddReading?: () => void;
}

export default function RecentReadingsSection({ 
  recentReadings, 
  onViewAll, 
  onAddReading 
}: RecentReadingsSectionProps) {
  // Default mock data - will be replaced with real data from props
  const defaultReadings: GlucoseReading[] = [
    { id: '1', value: 125, time: '2:30 PM', status: 'normal' },
    { id: '2', value: 110, time: '10:15 AM', status: 'normal' },
    { id: '3', value: 95, time: '7:00 AM', status: 'normal' },
  ];

  const readings = recentReadings || defaultReadings;

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
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-darkBlue">Recent Readings</Text>
        <TouchableOpacity onPress={onViewAll || (() => console.log('Navigate to View All'))}>
          <Text className="text-primary font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-lg shadow-sm border border-gray-100">
        {readings.map((reading, index) => (
          <View 
            key={reading.id}
            className={`flex-row items-center justify-between p-4 ${
              index < readings.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(reading.status)}`} />
              <View>
                <Text className="text-darkBlue font-semibold">
                  {reading.value} mg/dL
                </Text>
                <Text className="text-textSecondary text-sm">
                  {reading.time}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className={`text-sm font-medium capitalize ${getStatusTextColor(reading.status)}`}>
                {reading.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Add Reading Button */}
      <View className="mt-4">
        <Button
          title="+ Add New Reading"
          onPress={onAddReading || (() => console.log('Navigate to Add Reading'))}
          variant="outline"
          size="medium"
        />
      </View>
    </View>
  );
}
