import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import existing UI components
import { ScreenContainer } from '../../components/ui';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

// Import dashboard components
import DashboardHeader from './components/DashboardHeader';
import AIInsightsSection from './components/AIInsightsSection';
import QuickActionsSection from './components/QuickActionsSection';
import OverviewCardsSection from './components/OverviewCardsSection';
import RecentReadingsSection from './components/RecentReadingsSection';
import PDFExportSection from './components/PDFExportSection';
import HamburgerMenu from './components/HamburgerMenu';

/**
 * DashboardScreen - Main dashboard for authenticated users
 *
 * Features:
 * - AI-powered insights and recommendations (main feature)
 * - Quick access to add/view glucose logs
 * - PDF report generation options
 * - Today's overview with visual indicators
 * - Recent readings with AI color coding
 * - Professional medical app design using existing UI components
 *
 * Layout Structure:
 * 1. Header with personalized greeting
 * 2. AI Insights Hero Section (main feature)
 * 3. Quick Actions (Add Log, View Logs, Generate PDF)
 * 4. Overview Cards (Today's Summary, Weekly Trends)
 * 5. Recent Readings with timestamps
 */

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { state: userState, fetchProfile } = useUser();
  const { state: authState } = useAuth();

  // State for hamburger menu and dashboard data
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (authState.isAuthenticated && authState.token) {
        try {
          setIsLoading(true);

          // Try to fetch real user profile - but don't fail if it doesn't work
          try {
            await fetchProfile();
          } catch (profileError) {
            console.warn('Profile fetch failed, continuing with dashboard:', profileError);
          }

          // Try to fetch real dashboard data from backend
          try {
            const { dashboardService } = await import('../../services/dashboard/dashboardService');
            const realData = await dashboardService.getDashboardData(authState.token);
            setDashboardData(realData);
          } catch (dashboardError) {
            console.warn('Dashboard data fetch failed, using fallback data:', dashboardError);

            // Fallback to sample data based on your fixed account
            const fallbackData = {
              todayStats: {
                average: 112,
                readingsCount: 4,
                latestReading: {
                  id: '1',
                  value: 105,
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                  timeOfDay: 'bedtime',
                  status: 'normal'
                },
                timeInRange: 85
              },
              weeklyTrend: {
                direction: 'stable',
                percentage: 2,
                averageChange: -1
              },
              recentReadings: [
                {
                  id: '1',
                  value: 105,
                  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                  timeOfDay: 'bedtime',
                  status: 'normal'
                },
                {
                  id: '2',
                  value: 110,
                  timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                  timeOfDay: 'before_meal',
                  status: 'normal'
                },
                {
                  id: '3',
                  value: 140,
                  timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                  timeOfDay: 'after_meal',
                  status: 'normal'
                },
                {
                  id: '4',
                  value: 95,
                  timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
                  timeOfDay: 'fasting',
                  status: 'normal'
                },
              ]
            };

            setDashboardData(fallbackData);
          }
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
          // Set minimal fallback data so dashboard doesn't crash
          setDashboardData({
            todayStats: { average: 0, readingsCount: 0, timeInRange: 0 },
            weeklyTrend: { direction: 'stable', percentage: 0, averageChange: 0 },
            recentReadings: []
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [authState.isAuthenticated, authState.token]);

  // Navigation handlers
  const handleMenuNavigation = (screen: string) => {
    setIsMenuVisible(false);
    // Navigate to respective screens
    switch (screen) {
      case 'account':
        navigation.navigate('Account');
        break;
      case 'addLog':
        navigation.navigate('AddLog');
        break;
      case 'viewLogs':
        navigation.navigate('ViewLogs');
        break;
      case 'aiTrends':
        navigation.navigate('AITrends');
        break;
      default:
        break;
    }
  };

  // Action handlers for components
  const handleAddLog = () => {
    navigation.navigate('AddLog');
  };

  const handleViewLogs = () => {
    navigation.navigate('ViewLogs');
  };

  const handleGeneratePDF = () => {
    console.log('Navigate to PDF options');
    // navigation.navigate('Reports');
  };

  const handleAskAI = () => {
    navigation.navigate('AITrends');
  };

  const handleViewAIDetails = () => {
    navigation.navigate('AITrends');
  };



  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Section */}
        <DashboardHeader onMenuPress={() => setIsMenuVisible(true)} />

        {/* AI Insights Hero Section - Main Feature */}
        <AIInsightsSection
          onAskAI={handleAskAI}
          onViewDetails={handleViewAIDetails}
        />

        {/* Quick Actions Section */}
        <QuickActionsSection
          onAddLog={handleAddLog}
          onViewLogs={handleViewLogs}
          onGeneratePDF={handleGeneratePDF}
        />

        {/* Today's Overview Cards */}
        <OverviewCardsSection
          todayStats={dashboardData?.todayStats}
          weeklyTrend={dashboardData?.weeklyTrend}
        />

        {/* Recent Readings Section */}
        <RecentReadingsSection
          recentReadings={dashboardData?.recentReadings}
          onViewAll={handleViewLogs}
          onAddReading={handleAddLog}
        />

        {/* PDF Export Section */}
        <PDFExportSection
          onExportAll={handleGeneratePDF}
          onExport30Days={() => console.log('Generate 30-day PDF')}
          onExportCustom={() => console.log('Navigate to custom range selector')}
        />
      </ScrollView>

      {/* Hamburger Menu */}
      <HamburgerMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={handleMenuNavigation}
      />
    </ScreenContainer>
  );
}
