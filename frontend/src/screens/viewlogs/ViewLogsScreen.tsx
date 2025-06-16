import React from 'react';
import { ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer,
  NavigationHeader,
  DataSection,
  StatsCard,
  LogsList,
  Button
} from '../../components/ui';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';

/**
 * ViewLogsScreen - Display and manage glucose readings
 */

type ViewLogsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ViewLogs'>;

interface ViewLogsScreenProps {
  navigation: ViewLogsScreenNavigationProp;
}

export default function ViewLogsScreen({ navigation }: ViewLogsScreenProps) {
  const { auth } = useAppState();
  const { request } = useAPI();
  const userData = auth?.state?.user;

  // Fetch glucose logs 
  const {
    data: logs,
    isLoading,
    error,
    refetch
  } = useDataFetching({
    fetchFunction: async () => {
      const result = await request({
        endpoint: API_ENDPOINTS.GLUCOSE.LOGS,
        method: 'GET',
        token: auth?.state?.token || undefined
      });

      // Transform backend data to frontend format
      const glucoseData = result.data || {};
      const backendLogs = glucoseData.logs || [];

      return Array.isArray(backendLogs) ? backendLogs.map((log: any) => ({
        id: log.id,
        userId: log.user_id,
        value: log.glucose_value,
        unit: log.unit,
        logType: log.reading_type,
        notes: log.notes,
        timestamp: log.reading_time,
        createdAt: log.created_at
      })) : [];
    },
    dependencies: [auth?.state?.token],
    immediate: !!auth?.state?.token
  });

  const glucoseUnit = userData?.preferences?.glucoseUnit || 'mg/dL';

  // Handle add new reading
  const handleAddReading = () => navigation.navigate('AddLog');

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <NavigationHeader
        title="Glucose Logs"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightAction={
          <Button
            title="+ Add"
            onPress={handleAddReading}
            variant="primary"
            size="small"
          />
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Statistics Section */}
        <DataSection
          title="Summary Statistics"
          subtitle={`${logs?.length || 0} total readings`}
          isLoading={isLoading}
          error={error}
          isEmpty={!logs || logs.length === 0}
          onRetry={refetch}
          className="mx-4 mt-4"
        >
          <StatsCard
            title="Average Glucose"
            value={`${logs?.length ? '120' : '--'} ${glucoseUnit}`}
            subtitle="Last 30 days"
            color="primary"
          />
        </DataSection>

        {/* Glucose Logs List */}
        <DataSection
          title="Recent Readings"
          subtitle="Your glucose log history"
          isLoading={isLoading}
          error={error}
          isEmpty={!logs || logs.length === 0}
          onRetry={refetch}
          className="mx-4 mt-4"
        >
          <LogsList
            logs={logs || []}
            glucoseUnit={glucoseUnit}
            onAddReading={handleAddReading}
          />
        </DataSection>

        {/* Export Data Button */}
        {logs && logs.length > 0 && (
          <DataSection
            title="Export Options"
            subtitle="Download your glucose data"
            className="mx-4 mt-4"
          >
            <Button
              title="Export My Data"
              onPress={() => {
                // TODO: Implement export functionality
                console.log('Export data functionality to be implemented');
              }}
              variant="outline"
              size="large"
            />
          </DataSection>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
