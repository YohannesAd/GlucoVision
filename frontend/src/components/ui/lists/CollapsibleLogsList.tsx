import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlucoseLog } from '../../../types';
import LogItem from './LogItem';
import EmptyState from '../messages/EmptyState';
import Button from '../buttons/Button';
import { separateLogsByAge } from '../../../utils/filterUtils';

/**
 * CollapsibleLogsList Component
 * 
 * Professional collapsible list display for glucose readings
 * Shows recent logs by default with option to expand older logs
 * 
 * Features:
 * - Shows most recent 7-14 days by default
 * - Collapsible older logs section
 * - Professional expand/collapse UI
 * - Empty state handling
 * - Consistent styling
 * 
 * Used in:
 * - ViewLogsScreen (main list with filtering)
 * - DashboardScreen (recent readings)
 */

interface CollapsibleLogsListProps {
  logs: GlucoseLog[];
  glucoseUnit: string;
  onAddReading: () => void;
  title?: string;
  showAddButton?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionText?: string;
  recentDaysThreshold?: number;
  className?: string;
}

export default function CollapsibleLogsList({
  logs,
  glucoseUnit,
  onAddReading,
  title = "Glucose Readings",
  showAddButton = true,
  emptyTitle = "No Readings Found",
  emptyMessage = "No readings found for the selected filters.",
  emptyActionText = "Add First Reading",
  recentDaysThreshold = 14,
  className = ''
}: CollapsibleLogsListProps) {
  
  const [showOlderLogs, setShowOlderLogs] = useState(false);
  
  // Separate logs into recent and older
  const { recent: recentLogs, older: olderLogs } = separateLogsByAge(logs, recentDaysThreshold);
  
  // Determine which logs to show
  const displayLogs = showOlderLogs ? logs : recentLogs;
  
  return (
    <>
      {/* Main Readings List */}
      <View className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
        {title && (
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-bold text-darkBlue">
                {title}
              </Text>
              {logs.length > 0 && (
                <Text className="text-sm text-gray-500">
                  {showOlderLogs ? `${logs.length} total` : `${recentLogs.length} recent`}
                </Text>
              )}
            </View>
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
            {/* Recent Logs Section */}
            {recentLogs.length > 0 && (
              <View>
                {!showOlderLogs && recentLogs.length < logs.length && (
                  <View className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <Text className="text-sm text-gray-600 font-medium">
                      Recent Readings (Last {recentDaysThreshold} days)
                    </Text>
                  </View>
                )}
                
                {(showOlderLogs ? logs : recentLogs).map((log, index) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    showBorder={index < displayLogs.length - 1}
                    glucoseUnit={glucoseUnit}
                  />
                ))}
              </View>
            )}

            {/* Show Older Logs Button */}
            {!showOlderLogs && olderLogs.length > 0 && (
              <View className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <TouchableOpacity
                  onPress={() => setShowOlderLogs(true)}
                  className="flex-row items-center justify-center py-2"
                >
                  <Text className="text-primary font-medium mr-2">
                    🔽 Show Older Logs
                  </Text>
                  <Text className="text-sm text-gray-500">
                    ({olderLogs.length} more)
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Collapse Older Logs Button */}
            {showOlderLogs && olderLogs.length > 0 && (
              <View className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <TouchableOpacity
                  onPress={() => setShowOlderLogs(false)}
                  className="flex-row items-center justify-center py-2"
                >
                  <Text className="text-primary font-medium mr-2">
                    🔼 Show Recent Only
                  </Text>
                  <Text className="text-sm text-gray-500">
                    (Hide {olderLogs.length} older)
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

      {/* Summary Information */}
      {logs.length > 0 && (
        <View className="mt-4 px-4">
          <View className="bg-blue-50 rounded-lg p-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-medium text-blue-900">
                  Total Readings: {logs.length}
                </Text>
                <Text className="text-xs text-blue-700 mt-1">
                  Recent: {recentLogs.length} • Older: {olderLogs.length}
                </Text>
              </View>
              {logs.length > 0 && (
                <View className="items-end">
                  <Text className="text-xs text-blue-700">
                    Latest: {new Date(logs[0]?.timestamp).toLocaleDateString()}
                  </Text>
                  {logs.length > 1 && (
                    <Text className="text-xs text-blue-700">
                      Oldest: {new Date(logs[logs.length - 1]?.timestamp).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </>
  );
}
