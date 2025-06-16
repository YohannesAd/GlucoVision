import React from 'react';
import { View, Text } from 'react-native';
import { AIInsight } from '../../../types';
import Button from '../buttons/Button';

/**
 * AIInsightCard - Reusable component for displaying AI insights
 * Used in AI Trends, Dashboard, and other AI-related screens
 */

interface AIInsightCardProps {
  insight: AIInsight;
  onAction?: (insight: AIInsight) => void;
  showActionButton?: boolean;
  compact?: boolean;
  className?: string;
}

export default function AIInsightCard({
  insight,
  onAction,
  showActionButton = true,
  compact = false,
  className = ''
}: AIInsightCardProps) {
  // Get severity color classes
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'critical': return 'bg-red-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {/* Insight Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className={`w-3 h-3 rounded-full mr-3 ${getSeverityColor(insight.severity)}`} />
          <View className="flex-1">
            <Text className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-darkBlue`}>
              {insight.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-xs text-textSecondary mr-2">
                {insight.confidence}% confidence
              </Text>
              <View className={`px-2 py-1 rounded-full ${getSeverityBgColor(insight.severity)}`}>
                <Text className={`text-xs font-medium capitalize ${getSeverityTextColor(insight.severity)}`}>
                  {insight.type}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Insight Message */}
      <Text className={`text-textSecondary ${compact ? 'text-sm' : 'text-base'} leading-6 mb-4`}>
        {insight.message}
      </Text>

      {/* Factors */}
      {insight.factors && insight.factors.length > 0 && !compact && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-darkBlue mb-2">Key Factors:</Text>
          <View className="flex-row flex-wrap gap-2">
            {insight.factors.map((factor, index) => (
              <View key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-xs text-darkBlue">{factor}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actionable Recommendation */}
      {insight.actionable && insight.recommendation && !compact && (
        <View className={`rounded-lg p-4 mb-4 ${getSeverityBgColor(insight.severity)}`}>
          <Text className="text-sm font-semibold text-darkBlue mb-2">
            💡 AI Recommendation:
          </Text>
          <Text className="text-textSecondary text-sm leading-5">
            {insight.recommendation}
          </Text>
        </View>
      )}

      {/* Action Button */}
      {insight.actionable && showActionButton && onAction && (
        <Button
          title="Apply Recommendation"
          onPress={() => onAction(insight)}
          variant="outline"
          size="medium"
        />
      )}
    </View>
  );
}
