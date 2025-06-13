import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, GlucoseLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer, Button } from '../../components/ui';

/**
 * ViewLogsScreen - Display and manage glucose readings
 * 
 * Features:
 * - Chronological list of all glucose readings
 * - Color-coded status indicators (normal, high, low)
 * - Date/time stamps with meal context
 * - Filtering options (date range, meal context)
 * - Sorting options (newest/oldest first)
 * - Export functionality (CSV, PDF)
 * - Statistics summary
 * - Professional medical app design
 * 
 * Accessible from:
 * - Hamburger menu "View Logs"
 * - Dashboard "View All Logs" button
 * - Recent readings "View All" link
 */

type ViewLogsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ViewLogs'>;

interface ViewLogsScreenProps {
  navigation: ViewLogsScreenNavigationProp;
}

// Filter options
type DateFilter = 'today' | 'week' | 'month' | 'all';
type MealFilter = 'all' | 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
type SortOrder = 'newest' | 'oldest';

export default function ViewLogsScreen({ navigation }: ViewLogsScreenProps) {
  const { state } = useAuth();
  const { user } = state;

  // State for filters and data
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [mealFilter, setMealFilter] = useState<MealFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for now - will be replaced with GlucoseContext
  const [glucoseLogs, setGlucoseLogs] = useState<GlucoseLog[]>([
    {
      id: '1',
      userId: user?.id || '',
      value: 125,
      unit: 'mg/dL',
      logType: 'fasting',
      notes: 'Morning reading before breakfast',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: user?.id || '',
      value: 180,
      unit: 'mg/dL',
      logType: 'after_meal',
      notes: 'After lunch - had pasta',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      userId: user?.id || '',
      value: 95,
      unit: 'mg/dL',
      logType: 'before_meal',
      notes: '',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      userId: user?.id || '',
      value: 110,
      unit: 'mg/dL',
      logType: 'bedtime',
      notes: 'Before sleep',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      userId: user?.id || '',
      value: 85,
      unit: 'mg/dL',
      logType: 'fasting',
      notes: 'Feeling a bit low',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // Get user's preferred glucose unit
  const glucoseUnit = user?.preferences?.glucoseUnit || 'mg/dL';

  // Filter options data
  const dateFilterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  const mealFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'fasting', label: 'Fasting' },
    { value: 'before_meal', label: 'Before Meal' },
    { value: 'after_meal', label: 'After Meal' },
    { value: 'bedtime', label: 'Bedtime' },
    { value: 'random', label: 'Random' },
  ];

  // Get glucose status based on value
  const getGlucoseStatus = (value: number, logType: string): 'normal' | 'high' | 'low' => {
    // Basic glucose ranges (mg/dL) - these would come from medical guidelines
    if (logType === 'fasting') {
      if (value < 70) return 'low';
      if (value > 100) return 'high';
      return 'normal';
    } else if (logType === 'after_meal') {
      if (value < 70) return 'low';
      if (value > 140) return 'high';
      return 'normal';
    } else {
      if (value < 70) return 'low';
      if (value > 180) return 'high';
      return 'normal';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'high': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Format time for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format meal context for display
  const formatMealContext = (logType: string) => {
    switch (logType) {
      case 'fasting': return 'Fasting';
      case 'before_meal': return 'Before Meal';
      case 'after_meal': return 'After Meal';
      case 'bedtime': return 'Bedtime';
      case 'random': return 'Random';
      default: return 'Unknown';
    }
  };

  // Filter and sort logs
  const getFilteredLogs = () => {
    let filtered = [...glucoseLogs];

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfDay);
        break;
      case 'week':
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfWeek);
        break;
      case 'month':
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfMonth);
        break;
      // 'all' doesn't filter
    }

    // Apply meal context filter
    if (mealFilter !== 'all') {
      filtered = filtered.filter(log => log.logType === mealFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredLogs = getFilteredLogs();

  // Calculate statistics
  const getStatistics = () => {
    if (filteredLogs.length === 0) {
      return {
        average: 0,
        count: 0,
        normalCount: 0,
        highCount: 0,
        lowCount: 0,
        timeInRange: 0,
      };
    }

    const total = filteredLogs.reduce((sum, log) => sum + log.value, 0);
    const average = Math.round(total / filteredLogs.length);

    let normalCount = 0;
    let highCount = 0;
    let lowCount = 0;

    filteredLogs.forEach(log => {
      const status = getGlucoseStatus(log.value, log.logType);
      switch (status) {
        case 'normal': normalCount++; break;
        case 'high': highCount++; break;
        case 'low': lowCount++; break;
      }
    });

    const timeInRange = Math.round((normalCount / filteredLogs.length) * 100);

    return {
      average,
      count: filteredLogs.length,
      normalCount,
      highCount,
      lowCount,
      timeInRange,
    };
  };

  const statistics = getStatistics();

  // Handle export functionality
  const handleExport = (format: 'csv' | 'pdf') => {
    setIsLoading(true);

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Export Complete',
        `Your glucose data has been exported as ${format.toUpperCase()}. In a real app, this would download the file.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // TODO: Implement actual file download
              console.log(`Export ${format} with ${filteredLogs.length} records`);
            },
          },
        ]
      );
    }, 2000);
  };

  // Handle add new reading
  const handleAddReading = () => {
    navigation.navigate('AddLog');
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Text className="text-darkBlue text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkBlue">Glucose Logs</Text>
          <TouchableOpacity
            onPress={handleAddReading}
            className="p-2 -mr-2"
          >
            <Text className="text-primary text-lg font-medium">+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Statistics Summary */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Summary</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-darkBlue">{statistics.average}</Text>
              <Text className="text-textSecondary text-sm">Avg {glucoseUnit}</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-darkBlue">{statistics.count}</Text>
              <Text className="text-textSecondary text-sm">Total Readings</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{statistics.timeInRange}%</Text>
              <Text className="text-textSecondary text-sm">Time in Range</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-semibold text-green-600">{statistics.normalCount}</Text>
              <Text className="text-textSecondary text-xs">Normal</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-yellow-600">{statistics.highCount}</Text>
              <Text className="text-textSecondary text-xs">High</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-red-600">{statistics.lowCount}</Text>
              <Text className="text-textSecondary text-xs">Low</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Filters</Text>
          
          {/* Date Filter */}
          <View className="mb-4">
            <Text className="text-textSecondary text-sm mb-2">Time Period</Text>
            <View className="flex-row flex-wrap gap-2">
              {dateFilterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setDateFilter(option.value as DateFilter)}
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
                  onPress={() => setMealFilter(option.value as MealFilter)}
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
                onPress={() => setSortOrder('newest')}
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
                onPress={() => setSortOrder('oldest')}
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

        {/* Export Options */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Export Data</Text>
          <Text className="text-textSecondary text-sm mb-4">
            Export {filteredLogs.length} filtered readings for your healthcare provider
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                title={isLoading ? "Exporting..." : "Export CSV"}
                onPress={() => handleExport('csv')}
                variant="outline"
                disabled={isLoading || filteredLogs.length === 0}
              />
            </View>
            <View className="flex-1">
              <Button
                title={isLoading ? "Exporting..." : "Export PDF"}
                onPress={() => handleExport('pdf')}
                variant="primary"
                disabled={isLoading || filteredLogs.length === 0}
              />
            </View>
          </View>
        </View>

        {/* Glucose Readings List */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden">
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-darkBlue">
              Readings ({filteredLogs.length})
            </Text>
          </View>

          {filteredLogs.length === 0 ? (
            <View className="p-6 items-center">
              <Text className="text-textSecondary text-center">
                No readings found for the selected filters.
              </Text>
              <Button
                title="Add First Reading"
                onPress={handleAddReading}
                variant="primary"
                size="medium"
                containerClassName="mt-4"
              />
            </View>
          ) : (
            <View>
              {filteredLogs.map((log, index) => {
                const status = getGlucoseStatus(log.value, log.logType);
                return (
                  <View
                    key={log.id}
                    className={`p-4 ${
                      index < filteredLogs.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <View className="flex-row items-start justify-between">
                      {/* Left side - Value and status */}
                      <View className="flex-row items-center flex-1">
                        <View className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status)}`} />
                        <View className="flex-1">
                          <View className="flex-row items-baseline">
                            <Text className="text-xl font-bold text-darkBlue mr-2">
                              {log.value}
                            </Text>
                            <Text className="text-textSecondary text-sm">
                              {log.unit}
                            </Text>
                          </View>
                          <Text className="text-textSecondary text-sm">
                            {formatMealContext(log.logType)}
                          </Text>
                          {log.notes && (
                            <Text className="text-textSecondary text-sm mt-1 italic">
                              "{log.notes}"
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Right side - Date, time, and status */}
                      <View className="items-end">
                        <Text className="text-darkBlue font-medium text-sm">
                          {formatDate(log.timestamp)}
                        </Text>
                        <Text className="text-textSecondary text-xs">
                          {formatTime(log.timestamp)}
                        </Text>
                        <Text className={`text-xs font-medium capitalize mt-1 ${getStatusTextColor(status)}`}>
                          {status}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Add Reading Button */}
        {filteredLogs.length > 0 && (
          <View className="mx-4 mt-4">
            <Button
              title="+ Add New Reading"
              onPress={handleAddReading}
              variant="outline"
              size="large"
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
