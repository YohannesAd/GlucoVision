import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Main App Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AccountScreen from '../screens/account/AccountScreen';
import AddLogScreen from '../screens/addlog/AddLogScreen';
import ViewLogsScreen from '../screens/viewlogs/ViewLogsScreen';
import AITrendsScreen from '../screens/aitrends/AITrendsScreen';
// TODO: Add these screens when created
// import ViewLogsScreen from '../screens/logs/ViewLogsScreen';
// import AITrendsScreen from '../screens/analytics/AITrendsScreen';
// import ProfileScreen from '../screens/profile/ProfileScreen';
// import ReportsScreen from '../screens/reports/ReportsScreen';

/**
 * MainNavigator - Main app navigation for authenticated users
 * 
 * Structure:
 * - Tab Navigator: Bottom tabs for main features
 * - Stack Navigator: Modal screens and detailed views
 * 
 * Main Tabs:
 * - Dashboard: Overview and quick actions
 * - Logs: Glucose tracking and history
 * - Trends: AI insights and analytics
 * - Profile: User settings and preferences
 * 
 * Modal Screens:
 * - AddLog: Add new glucose reading
 * - Reports: Generate and view reports
 */

const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator<RootStackParamList>();

// Tab Navigator Component
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#3B82F6', // primary color
        tabBarInactiveTintColor: '#6B7280', // gray color
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          // TODO: Add tab bar icon
        }}
      />
      {/* TODO: Add remaining tab screens */}
      {/*
      <Tab.Screen
        name="ViewLogs"
        component={ViewLogsScreen}
        options={{
          tabBarLabel: 'Logs',
        }}
      />
      <Tab.Screen
        name="AITrends"
        component={AITrendsScreen}
        options={{
          tabBarLabel: 'Trends',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      */}
    </Tab.Navigator>
  );
}

// Main Stack Navigator with Tabs and Modals
export default function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tab Navigator */}
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          gestureEnabled: false, // Prevent swipe back from main app
        }}
      />
      
      {/* Modal Screens */}
      <MainStack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />

      <MainStack.Screen
        name="AddLog"
        component={AddLogScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      <MainStack.Screen
        name="ViewLogs"
        component={ViewLogsScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />

      <MainStack.Screen
        name="AITrends"
        component={AITrendsScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />

      {/* TODO: Add other modal screens */}
      {/*
      <MainStack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          presentation: 'modal',
        }}
      />
      */}
    </MainStack.Navigator>
  );
}
