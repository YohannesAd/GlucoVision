import React from 'react';
import { View, Text } from 'react-native';
import LoadingState from '../messages/LoadingState';
import ErrorMessage from '../messages/ErrorMessage';
import EmptyState from '../messages/EmptyState';
import Button from '../buttons/Button';

/**
 * DataSection Component
 */

interface DataSectionProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function DataSection({
  title,
  subtitle,
  isLoading = false,
  error,
  isEmpty = false,
  emptyTitle = "No Data Available",
  emptyMessage = "No data found for this section.",
  emptyActionText = "Refresh",
  onEmptyAction,
  onRetry,
  children,
  className = '',
  headerAction
}: DataSectionProps) {
  
  return (
    <View className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* Section Header */}
      <View className="px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold text-darkBlue">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-textSecondary text-sm mt-1">
                {subtitle}
              </Text>
            )}
          </View>
          {headerAction && (
            <View className="ml-4">
              {headerAction}
            </View>
          )}
        </View>
      </View>

      {/* Content Area */}
      <View className="p-6">
        {/* Loading State */}
        {isLoading && (
          <LoadingState
            message="Loading data..."
            variant="card"
            size="medium"
          />
        )}

        {/* Error State */}
        {error && !isLoading && (
          <View>
            <ErrorMessage
              message={error}
              variant="card"
              className="mb-4"
            />
            {onRetry && (
              <Button
                title="Try Again"
                onPress={onRetry}
                variant="outline"
                size="medium"
              />
            )}
          </View>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && !error && (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            actionText={emptyActionText}
            onAction={onEmptyAction}
            variant="minimal"
            size="medium"
          />
        )}

        {/* Content */}
        {!isLoading && !error && !isEmpty && children}
      </View>
    </View>
  );
}
