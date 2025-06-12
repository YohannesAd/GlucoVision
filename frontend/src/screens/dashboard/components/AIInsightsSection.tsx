import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../../components/ui';

/**
 * AIInsightsSection - Main AI-powered insights hero section
 *
 * Features:
 * - AI-generated recommendations and insights (main app feature)
 * - Trend analysis with visual indicators
 * - Personalized advice based on user data and onboarding info
 * - Professional medical design with emphasis on AI capabilities
 * - Structured for easy backend integration
 *
 * Props:
 * - aiInsight: AI insight data (will come from backend)
 * - onAskAI: Function to handle "Ask AI More" action
 * - onViewDetails: Function to handle "View Details" action
 */

interface AIInsight {
  type: 'recommendation' | 'warning' | 'trend' | 'alert';
  title: string;
  message: string;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
  severity: 'positive' | 'warning' | 'critical' | 'info';
}

interface AIInsightsSectionProps {
  aiInsight?: AIInsight;
  onAskAI?: () => void;
  onViewDetails?: () => void;
}

export default function AIInsightsSection({
  aiInsight,
  onAskAI,
  onViewDetails
}: AIInsightsSectionProps) {
  // Default mock data - will be replaced with real data from props
  const defaultInsight: AIInsight = {
    type: 'recommendation',
    title: 'Your glucose levels are trending well',
    message: 'Based on your recent readings, your glucose control has improved by 15% this week. Keep up the great work with your current routine!',
    confidence: 92,
    actionable: true,
    recommendation: 'Continue your current meal timing and consider adding a 10-minute walk after lunch.',
    severity: 'positive'
  };

  const insight = aiInsight || defaultInsight;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-error';
      default: return 'bg-info';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-info';
    }
  };

  return (
    <View className="px-6 py-4">
      {/* AI Insights Hero Card */}
      <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* AI Badge */}
        <View className="flex-row items-center mb-4">
          <View className="bg-primary rounded-full px-3 py-1 mr-3">
            <Text className="text-white text-xs font-semibold">AI INSIGHTS</Text>
          </View>
          <View className={`w-2 h-2 rounded-full ${getSeverityColor(insight.severity)}`} />
          <Text className={`text-xs font-medium ml-2 ${getSeverityTextColor(insight.severity)}`}>
            {insight.confidence}% confidence
          </Text>
        </View>

        {/* Main Insight */}
        <Text className="text-lg font-bold text-darkBlue mb-3">
          {insight.title}
        </Text>

        <Text className="text-textSecondary text-base leading-6 mb-4">
          {insight.message}
        </Text>

        {/* Actionable Recommendation */}
        {insight.actionable && insight.recommendation && (
          <View className="bg-softBlue rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-darkBlue mb-2">
              💡 Recommendation:
            </Text>
            <Text className="text-textSecondary text-sm leading-5">
              {insight.recommendation}
            </Text>
          </View>
        )}

        {/* Action Buttons using existing Button component */}
        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Button
              title="Ask AI More"
              onPress={onAskAI || (() => console.log('Ask AI More pressed'))}
              variant="primary"
            />
          </View>
          <View className="flex-1">
            <Button
              title="View Details"
              onPress={onViewDetails || (() => console.log('View Details pressed'))}
              variant="outline"
            />
          </View>
        </View>
      </View>

      {/* Quick AI Stats - Mock data for now */}
      <View className="flex-row mt-4 space-x-3">
        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            AI Trend
          </Text>
          <Text className="text-success text-lg font-bold">↗ Improving</Text>
        </View>

        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            Pattern Score
          </Text>
          <Text className="text-primary text-lg font-bold">8.5/10</Text>
        </View>

        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            Next Check
          </Text>
          <Text className="text-darkBlue text-lg font-bold">2h 15m</Text>
        </View>
      </View>
    </View>
  );
}
