import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer, DataSection, StatsCard, PeriodSelector,
  GlucoseChart, AIInsightCard, MLInsightsCard, Button
} from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';
import { useRecommendationActions } from '../../utils/RecommendationActions';
import { aiService } from '../../services/ai/aiService';

/**
 * AITrendsScreen - Real-time AI glucose analysis
 * Uses actual user data for medical-grade insights
 */

type AITrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AITrends'>;

interface AITrendsScreenProps {
  navigation: AITrendsScreenNavigationProp;
}

export default function AITrendsScreen({ navigation }: AITrendsScreenProps) {
  const { auth, glucose } = useAppState();
  const { request } = useAPI();
  const recommendationActions = useRecommendationActions(navigation);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [mlData, setMLData] = useState<any>(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState<any>(null);

  // Removed isReady check to prevent infinite loops

  // Period configuration
  const PERIOD_DAYS = { week: 7, month: 30, quarter: 90 };
  const getPeriodDays = (period: 'week' | 'month' | 'quarter') => PERIOD_DAYS[period] || 7;

  // Fetch AI insights using clean useAPI hook
  const { data: aiData, isLoading, error, refetch } = useDataFetching({
    fetchFunction: async () => {
      // Reduced debug logging to prevent spam
      console.log('AI Trends: Fetching data for period:', selectedPeriod);

      if (!auth?.state?.token || !glucose?.actions) {
        throw new Error('Authentication required');
      }

      const days = getPeriodDays(selectedPeriod);

      await glucose.actions.fetchLogs();

      const [insightsResult, recommendationsResult] = await Promise.all([
        request({
          endpoint: API_ENDPOINTS.AI.INSIGHTS,
          method: 'GET',
          params: { days },
          token: auth.state.token,
          showErrorAlert: false
        }),
        request({
          endpoint: API_ENDPOINTS.AI.RECOMMENDATIONS,
          method: 'GET',
          params: { days },
          token: auth.state.token,
          showErrorAlert: false
        })
      ]);

      // Fetch advanced ML data
      const [mlPatterns, analytics] = await Promise.all([
        aiService.getMLPatterns(auth.state.token!, days),
        aiService.getAdvancedAnalytics(auth.state.token!, days)
      ]);

      // Minimal debug logging
      console.log('AI data fetched successfully. Logs:', glucose.state.logs?.length || 0);
      console.log('ML patterns:', mlPatterns.clusters.length, 'clusters found');

      return {
        insights: insightsResult.data,
        recommendations: recommendationsResult.data,
        logs: glucose.state.logs || [],
        mlPatterns,
        analytics
      };
    },
    dependencies: [selectedPeriod, auth?.state?.token], // Simplified dependencies
    immediate: true, // Let the hook handle the initial fetch
    onError: (error) => console.error('Failed to load AI data:', error)
  });

  // Remove the manual useEffect to prevent double fetching
  // The useDataFetching hook will handle initial loading automatically

  // Process AI data for display
  const processedData = aiData ? {
    insights: aiData.insights?.data?.recommendations?.slice(0, 3).map((rec: any, index: number) => ({
      id: `rec-${index}`,
      type: 'recommendation' as const,
      title: rec.title || 'AI Recommendation',
      message: rec.message || 'Continue monitoring your glucose levels.',
      confidence: rec.confidence || 85,
      actionable: true,
      recommendation: rec.action || rec.message,
      severity: rec.priority === 'high' ? 'warning' as const : 'info' as const,
      createdAt: new Date().toISOString(),
      factors: [rec.type || 'General']
    })) || [],

    statistics: [
      { label: 'Avg mg/dL', value: aiData.insights?.data?.overview?.average_glucose || 120, color: 'primary' as const },
      { label: 'Time in Range', value: `${aiData.insights?.data?.overview?.time_in_range_percent || 70}%`, color: 'green' as const },
      { label: 'Readings', value: aiData.logs?.length || 0, color: 'blue' as const }
    ],

    chartData: aiData.logs?.length > 0 ? (() => {
      // Filter logs based on selected period
      const days = getPeriodDays(selectedPeriod);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const filteredLogs = aiData.logs.filter((log: any) =>
        new Date(log.timestamp) >= cutoffDate
      ).slice(-20); // Limit to last 20 points for chart readability

      if (filteredLogs.length === 0) return null;

      // Group logs by date and calculate average for each day
      const logsByDate = new Map();

      filteredLogs.forEach((log: any) => {
        const date = new Date(log.timestamp);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;

        if (!logsByDate.has(dateKey)) {
          logsByDate.set(dateKey, []);
        }
        logsByDate.get(dateKey).push(log.value);
      });

      // Convert to arrays with unique dates only
      const uniqueDates = Array.from(logsByDate.keys());
      const averageValues = uniqueDates.map(dateKey => {
        const values = logsByDate.get(dateKey);
        return Math.round(values.reduce((sum: number, val: number) => sum + val, 0) / values.length);
      });

      // For weekly view, ensure we show max 7 unique dates
      const maxPoints = selectedPeriod === 'week' ? 7 : uniqueDates.length;
      const finalDates = uniqueDates.slice(-maxPoints);
      const finalValues = averageValues.slice(-maxPoints);

      return {
        labels: finalDates,
        datasets: [{
          data: finalValues,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 3,
        }]
      };
    })() : null
  } : null;

  // Event handlers
  const handlePeriodChange = (period: 'week' | 'month' | 'quarter') => {
    setSelectedPeriod(period);
    // The refetch will be triggered automatically by the dependency change
    // No need for manual refetch to prevent loops
  };

  const handleAIChat = () => {
    navigation.navigate('AIChat');
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
          <Text className="text-xl font-bold text-darkBlue">AI Trends</Text>
          <Button
            title="🤖 Chat"
            onPress={handleAIChat}
            variant="outline"
            size="small"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* AI Statistics */}
        <DataSection
          title="AI Health Insights"
          subtitle={`AI analyzed ${processedData?.statistics[2]?.value || 0} glucose readings`}
          isLoading={isLoading}
          error={error}
          isEmpty={!processedData}
          onRetry={refetch}
          className="mx-4 mt-4"
          headerAction={
            <Button
              title="🔄 Refresh"
              onPress={refetch}
              variant="outline"
              size="small"
            />
          }
        >
          {processedData && (
            <View className="flex-row justify-between">
              {processedData.statistics.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.label}
                  value={stat.value}
                  color={stat.color}
                  size="medium"
                />
              ))}
            </View>
          )}
        </DataSection>

        {/* Period Selector */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          disabled={isLoading}
          className="mx-4 mt-4"
        />

        {/* Glucose Chart */}
        <DataSection
          title="Glucose Trends"
          subtitle={`Your glucose levels over the past ${selectedPeriod}`}
          isLoading={isLoading}
          error={error}
          isEmpty={!processedData?.chartData}
          className="mx-4 mt-4"
        >
          {processedData?.chartData && (
            <GlucoseChart
              data={processedData.chartData}
              title=""
              subtitle=""
            />
          )}
        </DataSection>

        {/* AI Insights */}
        <DataSection
          title="AI Insights & Recommendations"
          subtitle="Personalized insights based on your glucose patterns"
          isLoading={isLoading}
          error={error}
          isEmpty={!processedData?.insights?.length}
          className="mx-4 mt-4"
        >
          {processedData?.insights?.map((insight: any) => (
            <AIInsightCard
              key={insight.id}
              insight={insight}
              onAction={recommendationActions.handleInsightAction}
              className="mb-4"
            />
          ))}
        </DataSection>

        {/* Advanced ML Insights */}
        {aiData?.mlPatterns && aiData?.analytics && (
          <DataSection
            title="🧠 Advanced ML Analysis"
            subtitle="Machine learning insights from your glucose data"
            isLoading={isLoading}
            error={error}
            isEmpty={false}
            className="mx-4 mt-4"
          >
            <MLInsightsCard
              mlData={aiData.mlPatterns}
              advancedAnalytics={aiData.analytics}
              className="mb-4"
            />
          </DataSection>
        )}

      </ScrollView>
    </ScreenContainer>
  );
}