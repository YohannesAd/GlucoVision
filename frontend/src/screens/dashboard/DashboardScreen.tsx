import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Import existing UI components
import { ScreenContainer } from '../../components/ui';

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
  // State for hamburger menu
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Navigation handlers
  const handleMenuNavigation = (screen: string) => {
    setIsMenuVisible(false);
    // TODO: Navigate to respective screens when they are created
    switch (screen) {
      case 'account':
        // navigation.navigate('Profile');
        console.log('Navigate to Account/Profile');
        break;
      case 'addLog':
        // navigation.navigate('AddLog');
        console.log('Navigate to Add Log');
        break;
      case 'viewLogs':
        // navigation.navigate('ViewLogs');
        console.log('Navigate to View Logs');
        break;
      case 'aiTrends':
        // navigation.navigate('AITrends');
        console.log('Navigate to AI Trends');
        break;
      default:
        break;
    }
  };

  // Action handlers for components
  const handleAddLog = () => {
    console.log('Navigate to Add Log');
    // navigation.navigate('AddLog');
  };

  const handleViewLogs = () => {
    console.log('Navigate to View Logs');
    // navigation.navigate('ViewLogs');
  };

  const handleGeneratePDF = () => {
    console.log('Navigate to PDF options');
    // navigation.navigate('Reports');
  };

  const handleAskAI = () => {
    console.log('Navigate to AI Chat');
    // navigation.navigate('AIChat');
  };

  const handleViewAIDetails = () => {
    console.log('Navigate to AI Details');
    // navigation.navigate('AIDetails');
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
        <OverviewCardsSection />

        {/* Recent Readings Section */}
        <RecentReadingsSection
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
