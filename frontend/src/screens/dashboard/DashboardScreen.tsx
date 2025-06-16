import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenContainer, DataSection, StatsCard, LogsList, AIInsightCard,
  Button, DashboardHeader, NavigationMenu, PDFExportSection
} from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';

/**
 * DashboardScreen
 */

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { auth } = useAppState();
  const { request } = useAPI();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Fetch dashboard data using clean useAPI hook
  const { data: dashboardData, isLoading, error, refetch } = useDataFetching({
    fetchFunction: async () => {
      if (!auth?.state?.token) {
        throw new Error('Authentication required');
      }

      // Use your clean useAPI hook - backend data only
      const [glucoseResult, aiResult] = await Promise.all([
        request({
          endpoint: API_ENDPOINTS.GLUCOSE.LOGS,
          method: 'GET',
          params: { limit: 50 }, // Increased limit to get more data
          token: auth.state.token,
          showErrorAlert: false
        }),
        request({
          endpoint: API_ENDPOINTS.AI.INSIGHTS,
          method: 'GET',
          params: { days: 30 }, // Increased to 30 days for better AI analysis
          token: auth.state.token,
          showErrorAlert: false
        })
      ]);

      const glucoseData = glucoseResult.data || {};
      const logs = glucoseData.logs || []; // Extract logs array from response

      const todayLogs = Array.isArray(logs) ? logs.filter((log: any) => {
        const logDate = new Date(log.reading_time || log.timestamp); // Backend uses reading_time
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      }) : [];

      const todayAverage = todayLogs.length > 0
        ? Math.round(todayLogs.reduce((sum: number, log: any) => sum + (log.glucose_value || log.value), 0) / todayLogs.length)
        : 0;

      const timeInRange = todayLogs.length > 0
        ? Math.round((todayLogs.filter((log: any) => {
            const value = log.glucose_value || log.value;
            return value >= 80 && value <= 180;
          }).length / todayLogs.length) * 100)
        : 0;

      // Process AI insights with debugging
      console.log('AI Result:', aiResult);
      const aiData = aiResult.data?.data || aiResult.data || {};
      const aiRecommendations = aiData.recommendations || [];
      console.log('AI Recommendations:', aiRecommendations);
      console.log('Total glucose logs for AI:', logs?.length || 0);

      // Transform backend logs to frontend format
      const transformedLogs = Array.isArray(logs) ? logs.map((log: any) => ({
        id: log.id,
        userId: log.user_id,
        value: log.glucose_value,
        unit: log.unit,
        logType: log.reading_type, 
        notes: log.notes,
        timestamp: log.reading_time, 
        createdAt: log.created_at
      })) : [];

      return {
        statistics: [
          { label: 'Today Avg', value: todayAverage || '--', color: 'primary' as const },
          { label: 'Time in Range', value: `${timeInRange}%`, color: 'green' as const },
          { label: 'Total Readings', value: transformedLogs.length, color: 'blue' as const }
        ],
        recentLogs: transformedLogs.slice(0, 5),
        aiInsights: Array.isArray(aiRecommendations) ? aiRecommendations.slice(0, 2) : []
      };
    },
    dependencies: [auth?.state?.token],
    onError: (error) => console.error('Failed to load dashboard data:', error)
  });

  // Navigation handlers
  const handleMenuNavigation = (screen: string) => {
    setIsMenuVisible(false);
    switch (screen) {
      case 'account': navigation.navigate('Account'); break;
      case 'addLog': navigation.navigate('AddLog'); break;
      case 'viewLogs': navigation.navigate('ViewLogs'); break;
      case 'aiTrends': navigation.navigate('AITrends'); break;
    }
  };

  // Action handlers
  const handleAddLog = () => navigation.navigate('AddLog');
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Export ${format} requested`);
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <DashboardHeader onMenuPress={() => setIsMenuVisible(true)} />

        {/* Today's Statistics */}
        <DataSection
          title="Today's Overview"
          subtitle="Your glucose tracking summary"
          isLoading={isLoading}
          error={error}
          isEmpty={!dashboardData}
          onRetry={refetch}
          className="mx-4 mt-4"
          headerAction={
            <Button
              title="+ Add Log"
              onPress={handleAddLog}
              variant="primary"
              size="small"
            />
          }
        >
          {dashboardData && (
            <View className="flex-row justify-between">
              {dashboardData.statistics.map((stat: any, index: number) => (
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

        {/* AI Insights */}
        <DataSection
          title="AI Insights"
          subtitle="Personalized recommendations"
          isLoading={isLoading}
          error={error}
          isEmpty={!dashboardData?.aiInsights?.length}
          className="mx-4 mt-4"
          headerAction={
            <Button
              title="View All"
              onPress={() => navigation.navigate('AITrends')}
              variant="outline"
              size="small"
            />
          }
        >
          {dashboardData?.aiInsights?.map((insight: any, index: number) => (
            <AIInsightCard
              key={index}
              insight={{
                id: `insight-${index}`,
                type: 'recommendation',
                title: insight.title || 'AI Recommendation',
                message: insight.message || 'Continue monitoring your glucose levels.',
                confidence: insight.confidence || 85,
                actionable: true,
                recommendation: insight.action || insight.message,
                severity: 'info' as const,
                createdAt: new Date().toISOString(),
                factors: [insight.type || 'General']
              }}
              onAction={() => navigation.navigate('AITrends')}
              className="mb-4"
            />
          ))}
        </DataSection>

        {/* Recent Readings */}
        <DataSection
          title="Recent Readings"
          subtitle="Your latest glucose entries"
          isLoading={isLoading}
          error={error}
          isEmpty={!dashboardData?.recentLogs?.length}
          className="mx-4 mt-4"
          headerAction={
            <Button
              title="View All"
              onPress={() => navigation.navigate('ViewLogs')}
              variant="outline"
              size="small"
            />
          }
        >
          <LogsList
            logs={dashboardData?.recentLogs || []}
            glucoseUnit="mg/dL"
            onAddReading={handleAddLog}
            title=""
            showAddButton={false}
            emptyTitle="No Readings Yet"
            emptyMessage="Start tracking your glucose levels"
            emptyActionText="Add First Reading"
            className=""
          />
        </DataSection>

        {/* Export Options */}
        <PDFExportSection
          onExportAll={() => handleExport('pdf')}
          onExport30Days={() => handleExport('pdf')}
          onExportCustom={() => handleExport('csv')}
        />

      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />
    </ScreenContainer>
  );
}
