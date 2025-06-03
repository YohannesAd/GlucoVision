import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
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

      <View className="flex-1 px-6 py-8">
        {/* Top Section - Logo and Title */}
        <View className="items-center mb-8">
          <View className="bg-white rounded-full p-6 shadow-lg mb-4">
            <Image
              source={require('../../../assets/logo.png')}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text className="text-3xl font-bold text-darkBlue mb-2">
            GlucoVision
          </Text>

          {/* Tagline */}
          <Text className="text-base text-textSecondary font-medium text-center">
            Track smarter. Live healthier.
          </Text>
        </View>

        {/* Middle Section - Description and Features */}
        <View className="flex-1 justify-center">
          {/* Description */}
          <Text className="text-center text-textPrimary text-sm leading-relaxed mb-6 px-4">
            Take control of your diabetes with AI-powered insights and personalized tracking.
          </Text>

          {/* Feature Highlights - Compact */}
          <View className="w-full">
            <View className="flex-row items-center bg-white/50 rounded-xl p-4 mb-3">
              <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">📊</Text>
              </View>
              <Text className="flex-1 text-gray-800 font-medium text-base">
                Smart glucose tracking with AI insights
              </Text>
            </View>

            <View className="flex-row items-center bg-white/50 rounded-xl p-4 mb-3">
              <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">🎯</Text>
              </View>
              <Text className="flex-1 text-gray-800 font-medium text-base">
                Personalized recommendations for better health
              </Text>
            </View>

            <View className="flex-row items-center bg-white/50 rounded-xl p-4">
              <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">📈</Text>
              </View>
              <Text className="flex-1 text-gray-800 font-medium text-base">
                Comprehensive reports for your next doctor's visit
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section - Call to Action */}
        <View className="w-full mt-8">
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
