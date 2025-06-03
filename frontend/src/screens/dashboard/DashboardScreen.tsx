import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-darkBlue mb-4">
          Dashboard
        </Text>
        <Text className="text-textSecondary text-center">
          Welcome to your GlucoVision dashboard!{'\n'}
          This screen will be implemented next.
        </Text>
      </View>
    </SafeAreaView>
  );
}
