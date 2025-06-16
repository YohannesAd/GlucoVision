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

const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator<RootStackParamList>();

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
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          gestureEnabled: false,
        }}
      />

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
    </MainStack.Navigator>
  );
}
