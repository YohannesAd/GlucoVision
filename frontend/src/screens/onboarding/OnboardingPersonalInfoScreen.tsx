import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingPersonalInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo'>;

interface OnboardingPersonalInfoScreenProps {
  navigation: OnboardingPersonalInfoScreenNavigationProp;
}

export default function OnboardingPersonalInfoScreen({ navigation }: OnboardingPersonalInfoScreenProps) {
  const handleNext = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-darkBlue mb-4">
          Personal Information
        </Text>
        <Text className="text-textSecondary text-center mb-8">
          This is where users will fill out their personal information.{'\n'}
          This screen will be implemented next.
        </Text>
        
        <Button
          title="Continue to Dashboard (Temporary)"
          onPress={handleNext}
          variant="primary"
          size="large"
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}
