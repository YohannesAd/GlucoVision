import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  ScreenContainer,
  NavigationHeader,
  DataSection,
  StatsCard,
  Button,
  PDFExportModal
} from '../../components/ui';
import LogFilters from '../../components/ui/sections/LogFilters';
import CollapsibleLogsList from '../../components/ui/lists/CollapsibleLogsList';
import { useAppState, useDataFetching, useAPI, API_ENDPOINTS } from '../../hooks';
import {
  applyFilters,
  getFilterSummary,
  hasActiveFilters,
  getDefaultFilters,
  type FilterOptions,
  type DateFilter,
  type MealFilter,
  type SortOrder,
  type ValueRange
} from '../../utils/filterUtils';

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

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>(getDefaultFilters());

  // PDF Export state
  const [showPDFExport, setShowPDFExport] = useState(false);

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

  const glucoseUnit = userData?.preferredUnit || 'mg/dL';

  // Apply filters to logs
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return applyFilters(logs, filters);
  }, [logs, filters]);

  // Filter summary
  const filterSummary = useMemo(() => {
    if (!logs) return '';
    return getFilterSummary(filters, logs.length, filteredLogs.length);
  }, [logs, filteredLogs, filters]);

  // Check if filters are active
  const isFiltered = hasActiveFilters(filters);

  // Handle add new reading
  const handleAddReading = () => navigation.navigate('AddLog');

  // Filter handlers
  const handleDateFilterChange = (dateFilter: DateFilter) => {
    setFilters(prev => ({ ...prev, dateFilter }));
  };

  const handleMealFilterChange = (mealFilter: MealFilter) => {
    setFilters(prev => ({ ...prev, mealFilter }));
  };

  const handleSortOrderChange = (sortOrder: SortOrder) => {
    setFilters(prev => ({ ...prev, sortOrder }));
  };

  const handleValueRangeChange = (valueRange: ValueRange) => {
    setFilters(prev => ({ ...prev, valueRange }));
  };



  const handleClearFilters = () => {
    setFilters(getDefaultFilters());
  };

  // PDF Export handlers
  const handleOpenPDFExport = () => {
    setShowPDFExport(true);
  };

  const handleClosePDFExport = () => {
    setShowPDFExport(false);
  };



  // Prepare user info for PDF export
  const userInfoForPDF = {
    fullName: userData?.profile?.personalInfo?.fullName || userData?.email || 'Unknown User',
    email: userData?.email || '',
    age: userData?.profile?.personalInfo?.age,
    gender: userData?.profile?.personalInfo?.gender,
    dateOfBirth: userData?.profile?.personalInfo?.dateOfBirth
  };

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
        {/* Smart Filters Section */}
        <View className="mx-4 mt-4">
          <LogFilters
            dateFilter={filters.dateFilter}
            mealFilter={filters.mealFilter}
            sortOrder={filters.sortOrder}
            valueRange={filters.valueRange}
            onDateFilterChange={handleDateFilterChange}
            onMealFilterChange={handleMealFilterChange}
            onSortOrderChange={handleSortOrderChange}
            onValueRangeChange={handleValueRangeChange}
          />
        </View>

        {/* Statistics Section */}
        <DataSection
          title="Summary Statistics"
          subtitle={filterSummary}
          isLoading={isLoading}
          error={error}
          isEmpty={!logs || logs.length === 0}
          onRetry={refetch}
          className="mx-4 mt-4"
        >
          <StatsCard
            title="Average Glucose"
            value={`${filteredLogs?.length ? Math.round(filteredLogs.reduce((sum, log) => sum + log.value, 0) / filteredLogs.length) : '--'} ${glucoseUnit}`}
            subtitle={isFiltered ? "Filtered results" : "All readings"}
            color="primary"
          />
        </DataSection>

        {/* Glucose Logs List with Collapsible Older Logs */}
        <DataSection
          title="Glucose Readings"
          subtitle="Your filtered glucose log history"
          isLoading={isLoading}
          error={error}
          isEmpty={!logs || logs.length === 0}
          onRetry={refetch}
          className="mx-4 mt-4"
        >
          <CollapsibleLogsList
            logs={filteredLogs}
            glucoseUnit={glucoseUnit}
            onAddReading={handleAddReading}
            title=""
            showAddButton={false}
            emptyTitle={isFiltered ? "No Matching Readings" : "No Readings Yet"}
            emptyMessage={isFiltered ? "No readings match your current filters. Try adjusting your criteria." : "Start tracking your glucose levels by adding your first reading."}
            emptyActionText={isFiltered ? "Clear Filters" : "Add First Reading"}
            recentDaysThreshold={14}
          />
        </DataSection>

        {/* Filter Summary and Actions */}
        {isFiltered && filteredLogs.length > 0 && (
          <View className="mx-4 mt-4">
            <View className="bg-blue-50 rounded-xl p-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-blue-900">
                    {filterSummary}
                  </Text>
                </View>
                <Button
                  title="Clear Filters"
                  onPress={handleClearFilters}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>
          </View>
        )}

        {/* Export Data Button */}
        {filteredLogs && filteredLogs.length > 0 && (
          <DataSection
            title="Export Options"
            subtitle={`Download your ${isFiltered ? 'filtered ' : ''}glucose data`}
            className="mx-4 mt-4"
          >
            <Button
              title={`Export ${isFiltered ? 'Filtered ' : ''}PDF Report`}
              onPress={handleOpenPDFExport}
              variant="outline"
              size="large"
            />
          </DataSection>
        )}
      </ScrollView>

      {/* PDF Export Modal */}
      <PDFExportModal
        visible={showPDFExport}
        onClose={handleClosePDFExport}
        logs={logs || []}
        userInfo={userInfoForPDF}
        glucoseUnit={glucoseUnit}
      />
    </ScreenContainer>
  );
}
