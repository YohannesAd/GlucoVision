import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Main App Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AccountScreen from '../screens/account/AccountScreen';
import ChangePasswordScreen from '../screens/account/ChangePasswordScreen';
import AddLogScreen from '../screens/addlog/AddLogScreen';
import ViewLogsScreen from '../screens/viewlogs/ViewLogsScreen';
import AITrendsScreen from '../screens/aitrends/AITrendsScreen';
import AIChatScreen from '../screens/aichat/AIChatScreen';

const MainStack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen
        name="Dashboard"
        component={DashboardScreen}
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
        name="ChangePassword"
        component={ChangePasswordScreen}
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

      <MainStack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </MainStack.Navigator>
  );
}
