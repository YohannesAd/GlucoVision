import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';

/**
 * DashboardHeader - Header section with personalized greeting and hamburger menu
 * 
 * Features:
 * - Personalized welcome message with user's name
 * - Current date display
 * - Hamburger menu for navigation
 * - Professional medical app styling
 * - Uses user data from AuthContext
 * 
 * Props:
 * - onMenuPress: Function to handle hamburger menu press
 */

interface DashboardHeaderProps {
  onMenuPress: () => void;
}

export default function DashboardHeader({ onMenuPress }: DashboardHeaderProps) {
  const { state } = useAuth();
  const { user } = state;

  // Get current date in readable format
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="bg-white px-6 py-6 border-b border-gray-100">
      <View className="flex-row justify-between items-start">
        {/* Left side - Greeting */}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-darkBlue">
            {getGreeting()}, {user?.firstName || 'User'}!
          </Text>
          <Text className="text-textSecondary text-base mt-1">
            {getCurrentDate()}
          </Text>
        </View>
        
        {/* Right side - Hamburger Menu */}
        <TouchableOpacity
          onPress={onMenuPress}
          className="p-2 -mr-2"
          activeOpacity={0.7}
        >
          <View className="space-y-1">
            <View className="w-5 h-0.5 bg-darkBlue" />
            <View className="w-5 h-0.5 bg-darkBlue" />
            <View className="w-5 h-0.5 bg-darkBlue" />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Status Indicator */}
      <View className="flex-row items-center mt-3">
        <View className="w-3 h-3 bg-success rounded-full mr-2" />
        <Text className="text-textSecondary text-sm">
          Your glucose tracking is up to date
        </Text>
      </View>
    </View>
  );
}
