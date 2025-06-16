import React from 'react';
import { View, Text } from 'react-native';
import Button from '../buttons/Button';
import { AIInsight } from '../../../types';
import { useUser } from '../../../context/UserContext';

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

interface AIInsightsSectionProps {
  aiInsight?: AIInsight | null;
  aiTrendData?: any;
  isLoading?: boolean;
  onAskAI?: () => void;
  onViewDetails?: () => void;
}

export default function AIInsightsSection({
  aiInsight,
  aiTrendData,
  isLoading = false,
  onAskAI,
  onViewDetails
}: AIInsightsSectionProps) {
  const userContext = useUser();
  const userProfile = userContext?.state?.profile || null;

  // Default mock data with personalization based on user profile
  const defaultInsight: AIInsight = {
    id: 'default-insight',
    type: 'recommendation',
    title: `${userProfile?.firstName || 'Your'} glucose levels are trending well`,
    message: `Based on your ${userProfile?.diabetesType || 'diabetes'} management and recent readings, your glucose control has improved by 15% this week. Keep up the great work with your current routine!`,
    confidence: 92,
    severity: 'positive',
    actionable: true,
    recommendation: userProfile?.usesInsulin
      ? 'Continue your current insulin timing and consider adding a 10-minute walk after lunch.'
      : 'Continue your current meal timing and consider adding a 10-minute walk after lunch.',
    createdAt: new Date().toISOString(),
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
          {isLoading ? (
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
              <Text className="text-xs font-medium text-gray-400">Analyzing...</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full ${getSeverityColor(insight.severity)}`} />
              <Text className={`text-xs font-medium ml-2 ${getSeverityTextColor(insight.severity)}`}>
                {insight.confidence}% confidence
              </Text>
            </View>
          )}
        </View>

        {/* Main Insight */}
        <Text className="text-lg font-bold text-darkBlue mb-3">
          {isLoading ? 'Analyzing your glucose patterns...' : insight.title}
        </Text>

        <Text className="text-textSecondary text-base leading-6 mb-4">
          {isLoading ? 'Our AI is processing your glucose data to provide personalized insights.' : insight.message}
        </Text>

        {/* Actionable Recommendation */}
        {!isLoading && insight.actionable && insight.recommendation && (
          <View className="bg-softBlue rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-darkBlue mb-2">
              💡 Recommendation:
            </Text>
            <Text className="text-textSecondary text-sm leading-5">
              {insight.recommendation}
            </Text>
          </View>
        )}

        {isLoading && (
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-sm font-semibold text-gray-400 mb-2">
              💡 Generating recommendation...
            </Text>
            <Text className="text-gray-400 text-sm leading-5">
              Please wait while we analyze your data.
            </Text>
          </View>
        )}

        {/* Action Buttons using existing Button component */}
        <View className="flex-row space-x-3">
          <View className="flex-1">
            <Button
              title={isLoading ? "Analyzing..." : "Ask AI More"}
              onPress={onAskAI || (() => console.log('Ask AI More pressed'))}
              variant="primary"
              disabled={isLoading}
            />
          </View>
          <View className="flex-1">
            <Button
              title={isLoading ? "Loading..." : "View Details"}
              onPress={onViewDetails || (() => console.log('View Details pressed'))}
              variant="outline"
              disabled={isLoading}
            />
          </View>
        </View>
      </View>

      {/* Real-time AI Stats */}
      <View className="flex-row mt-4 space-x-3">
        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            AI Trend
          </Text>
          {isLoading ? (
            <Text className="text-gray-400 text-lg font-bold">Loading...</Text>
          ) : (
            <Text className="text-success text-lg font-bold">
              {aiTrendData?.trend || '→ Stable'}
            </Text>
          )}
        </View>

        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            Pattern Score
          </Text>
          {isLoading ? (
            <Text className="text-gray-400 text-lg font-bold">--/10</Text>
          ) : (
            <Text className="text-primary text-lg font-bold">
              {aiTrendData?.patternScore?.toFixed(1) || '7.5'}/10
            </Text>
          )}
        </View>

        <View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <Text className="text-textSecondary text-xs uppercase tracking-wide mb-1">
            Next Check
          </Text>
          {isLoading ? (
            <Text className="text-gray-400 text-lg font-bold">--h --m</Text>
          ) : (
            <Text className="text-darkBlue text-lg font-bold">
              {aiTrendData?.nextCheckTime || '2h 30m'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
