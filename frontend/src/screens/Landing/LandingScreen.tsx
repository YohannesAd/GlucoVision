import React from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

interface LandingScreenProps {
  navigation: LandingScreenNavigationProp;
}

export default function LandingScreen({ navigation }: LandingScreenProps) {
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-softBlue">
      <StatusBar barStyle="dark-content" backgroundColor="#EBF4FF" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-6 py-8">
          {/* Logo Section */}
          <View className="items-center mb-8">
            <View className="bg-white rounded-full p-6 shadow-lg mb-6">
              <Image
                source={require('../../../assets/logo.png')}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>

            {/* App Name */}
            <Text className="text-4xl font-bold text-darkBlue mb-2">
              GlucoVision
            </Text>

            {/* Tagline */}
            <Text className="text-lg text-textSecondary font-medium">
              Track smarter. Live healthier.
            </Text>
          </View>

          {/* Features Section */}
          <View className="w-full mb-8">
            <Text className="text-center text-textPrimary text-base leading-relaxed mb-6">
              Take control of your diabetes with AI-powered insights and personalized tracking.
            </Text>

            {/* Feature Highlights */}
            <View className="space-y-4">
              <View className="flex-row items-center bg-white/50 rounded-xl p-4">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">📊</Text>
                </View>
                <Text className="text-textPrimary font-medium flex-1">
                  Smart glucose tracking with AI insights
                </Text>
              </View>

              <View className="flex-row items-center bg-white/50 rounded-xl p-4">
                <View className="w-8 h-8 bg-secondary rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">🎯</Text>
                </View>
                <Text className="text-textPrimary font-medium flex-1">
                  Personalized recommendations for better health
                </Text>
              </View>

              <View className="flex-row items-center bg-white/50 rounded-xl p-4">
                <View className="w-8 h-8 bg-accent rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">📈</Text>
                </View>
                <Text className="text-textPrimary font-medium flex-1">
                  Comprehensive reports for your healthcare team
                </Text>
              </View>
            </View>
          </View>

          {/* Call to Action */}
          <View className="w-full">
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              style={{ width: '100%' }}
            />

            <Text className="text-center text-textMuted text-sm mt-4">
              Join thousands of users managing their diabetes better
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
