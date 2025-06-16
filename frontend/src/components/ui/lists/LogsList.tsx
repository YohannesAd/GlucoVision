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
  className = ''
}: LogsListProps) {
  
  return (
    <>
      {/* Readings List */}
      <View className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
        {title && (
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-darkBlue">
              {title}
            </Text>
          </View>
        )}

        {logs.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            icon="📊"
            actionText={emptyActionText}
            onAction={onAddReading}
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
