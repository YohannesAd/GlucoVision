import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScreenContainer, DataSection, StatsCard, LogsList, AIInsightCard,
  Button, DashboardHeader, NavigationMenu, PDFExportSection, PDFExportModal
} from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';
import { useRecommendationActions } from '../../utils/RecommendationActions';

/**
 * DashboardScreen
 */

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { auth, glucose } = useAppState();
  const { request } = useAPI();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Add recommendation actions for direct reminder functionality
  const recommendationActions = useRecommendationActions(navigation);
  const { data: dashboardData, isLoading, error, refetch } = useDataFetching({
    fetchFunction: async () => {
      if (!auth?.state?.token) {
        throw new Error('Authentication required');
      }

      const glucoseResult = await request({
        endpoint: API_ENDPOINTS.GLUCOSE.LOGS,
        method: 'GET',
        params: { limit: 50 }, 
        token: auth.state.token,
        showErrorAlert: false
      });
      let aiResult: any = { data: { data: { recommendations: [] } } };
      try {
        aiResult = await request({
          endpoint: API_ENDPOINTS.AI.INSIGHTS,
          method: 'GET',
          params: { days: 30 },
          token: auth.state.token,
          showErrorAlert: false
        });
      } catch (error) {
        // Use fallback AI insights with correct structure
        aiResult = {
          data: {
            data: {
              recommendations: [
                {
                  title: "Keep Monitoring",
                  message: "Continue tracking your glucose levels regularly for better insights.",
                  confidence: 85,
                  type: "general",
                  action: "Continue tracking your glucose levels regularly for better insights."
                }
              ]
            }
          }
        };
      }

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

      // Process AI insights
      const aiData = aiResult.data?.data || aiResult.data || {};
      const aiRecommendations = aiData.recommendations || [];

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
          { label: 'Today Readings', value: todayLogs.length, color: 'blue' as const }
        ],
        recentLogs: transformedLogs.slice(0, 5),
        aiInsights: Array.isArray(aiRecommendations) ? aiRecommendations.slice(0, 2) : []
      };
    },
    dependencies: [auth?.state?.token], // Only depend on auth token, not glucose logs to prevent loops
    onError: (error) => console.error('Failed to load dashboard data:', error)
  });

  // Initialize glucose data on mount
  useEffect(() => {
    if (auth?.state?.token && glucose?.actions?.fetchLogs) {
      glucose.actions.fetchLogs().catch(console.error);
    }
  }, [auth?.state?.token]);

  // Manual refresh function for when user adds new logs
  const handleDataRefresh = useCallback(() => {
    const now = Date.now();
    // Prevent refreshing more than once every 5 seconds
    if (now - lastRefreshTime < 5000) {
      return;
    }

    setLastRefreshTime(now);
    refetch();
  }, [refetch, lastRefreshTime]);

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
  const handleOpenPDFExport = () => setShowPDFExport(true);
  const handleClosePDFExport = () => setShowPDFExport(false);

  // Prepare user info for PDF export
  const userData = auth?.state?.user;
  const userInfoForPDF = {
    fullName: userData?.firstName && userData?.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData?.email || 'Unknown User',
    email: userData?.email || '',
    age: userData?.age,
    gender: userData?.gender,
    dateOfBirth: userData?.dateOfBirth || userData?.date_of_birth
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

        {/* Manual Refresh Button */}
        <View className="mx-4 mt-2">
          <Button
            title="🔄 Refresh Data"
            onPress={handleDataRefresh}
            variant="outline"
            size="small"
            disabled={isLoading}
          />
        </View>

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

        {/* Gluco Insights */}
        <DataSection
          title="Gluco Insights"
          subtitle="Personalized recommendations"
          isLoading={isLoading}
          error={error}
          isEmpty={!dashboardData?.aiInsights?.length}
          emptyTitle="Gluco Insights Loading"
          emptyMessage="Add more glucose readings to get personalized insights"
          emptyActionText="Add Reading"
          onEmptyAction={handleAddLog}
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
                title: insight.title || 'Gluco Recommendation',
                message: insight.message || 'Continue monitoring your glucose levels.',
                confidence: insight.confidence || 85,
                actionable: true,
                recommendation: insight.action || insight.message,
                severity: 'info' as const,
                createdAt: new Date().toISOString(),
                factors: [insight.type || 'General']
              }}
              onAction={recommendationActions.handleInsightAction}
              className="mb-4"
            />
          ))}
        </DataSection>

        {/* Gluco Chat Navigation */}
        <View className="mx-4 mt-4 mb-2">
          <Button
            title="💬 Ask Gluco Assistant"
            onPress={() => navigation.navigate('AIChat')}
            variant="outline"
            size="large"
          />
        </View>

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
          onExportAll={handleOpenPDFExport}
        />

      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />

      {/* PDF Export Modal */}
      <PDFExportModal
        visible={showPDFExport}
        onClose={handleClosePDFExport}
        logs={dashboardData?.recentLogs || []}
        userInfo={userInfoForPDF}
        glucoseUnit="mg/dL"
      />
    </ScreenContainer>
  );
}
