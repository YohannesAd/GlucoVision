import React from 'react';
import { View, Text } from 'react-native';
import { GlucoseLog } from '../../../types';
import LogItem from './LogItem';
import EmptyState from '../messages/EmptyState';
import Button from '../buttons/Button';

/**
 * LogsList Component
 *
 * Professional list display for glucose readings
 * Handles empty states and individual log rendering
 * Enhanced with filter support and improved empty states
 *
 * Used in:
 * - ViewLogsScreen (main list)
 * - DashboardScreen (recent readings)
 * - AITrendsScreen (filtered readings)
 */

interface LogsListProps {
  logs: GlucoseLog[];
  glucoseUnit: string;
  onAddReading: () => void;
  title?: string;
  showAddButton?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionText?: string;
  className?: string;
  isFiltered?: boolean;
  filterSummary?: string;
  onClearFilters?: () => void;
}

export default function LogsList({
  logs,
  glucoseUnit,
  onAddReading,
  title = "Readings",
  showAddButton = true,
  emptyTitle = "No Readings Found",
  emptyMessage = "No readings found for the selected filters.",
  emptyActionText = "Add First Reading",
  className = '',
  isFiltered = false,
  filterSummary,
  onClearFilters
}: LogsListProps) {

  // Enhanced empty message for filtered results
  const getEmptyMessage = () => {
    if (isFiltered) {
      return "No readings match your current filters. Try adjusting your filter criteria or clear filters to see all readings.";
    }
    return emptyMessage;
  };

  const getEmptyActionText = () => {
    if (isFiltered && onClearFilters) {
      return "Clear Filters";
    }
    return emptyActionText;
  };

  const handleEmptyAction = () => {
    if (isFiltered && onClearFilters) {
      onClearFilters();
    } else {
      onAddReading();
    }
  };

  return (
    <>
      {/* Readings List */}
      <View className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
        {title && (
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-darkBlue">
                {title}
              </Text>
              {logs.length > 0 && (
                <Text className="text-sm text-gray-500">
                  {logs.length} reading{logs.length !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
            {filterSummary && (
              <Text className="text-sm text-gray-600 mt-1">
                {filterSummary}
              </Text>
            )}
          </View>
        )}

        {logs.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            message={getEmptyMessage()}
            icon={isFiltered ? "🔍" : "📊"}
            actionText={getEmptyActionText()}
            onAction={handleEmptyAction}
            variant="default"
          />
        ) : (
          <View>
            {logs.map((log, index) => (
              <LogItem
                key={log.id}
                log={log}
                showBorder={index < logs.length - 1}
                glucoseUnit={glucoseUnit}
              />
            ))}
          </View>
        )}
      </View>

      {/* Filter Summary and Clear Button */}
      {isFiltered && logs.length > 0 && onClearFilters && (
        <View className="mt-3 px-4">
          <View className="bg-blue-50 rounded-lg p-3 flex-row justify-between items-center">
            <Text className="text-sm text-blue-800 flex-1">
              Filters applied
            </Text>
            <Button
              title="Clear Filters"
              onPress={onClearFilters}
              variant="outline"
              size="small"
            />
          </View>
        </View>
      )}

      {/* Add Reading Button */}
      {logs.length > 0 && showAddButton && (
        <View className="mt-4">
          <Button
            title="+ Add New Reading"
            onPress={onAddReading}
            variant="outline"
            size="large"
          />
        </View>
      )}
    </>
  );
}
