import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScreenContainer, Button, FeatureItem } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * LandingScreen - App introduction and onboarding entry point
 *
 * Features:
 * - App branding (logo, name, tagline)
 * - Key feature highlights with icons
 * - Call-to-action button to start user journey
 * - Fixed layout that fits all screen sizes
 * - Consistent UI using shared components
 */

type LandingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

interface LandingScreenProps {
  navigation: LandingScreenNavigationProp;
}

export default function LandingScreen({ navigation }: LandingScreenProps) {
  // Navigate to login screen to start user journey
  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer
      backgroundColor="bg-softBlue"
      statusBarBackgroundColor="#EBF4FF"
    >
      <View className="flex-1 px-6 py-8">
        {/* App Branding Section */}
        <View className="items-center mb-8">
          {/* App Logo */}
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

          {/* App Tagline */}
          <Text className="text-base text-textSecondary font-medium text-center">
            Track smarter. Live healthier.
          </Text>
        </View>

        {/* Content Section */}
        <View className="flex-1 justify-center">
          {/* App Description */}
          <Text className="text-center text-textPrimary text-sm leading-relaxed mb-6 px-4">
            Take control of your diabetes with AI-powered insights and personalized tracking.
          </Text>

          {/* Key Features List */}
          <View className="w-full">
            <FeatureItem
              icon="📊"
              text="Smart glucose tracking with AI insights"
              iconBackgroundColor="bg-primary"
            />

            <FeatureItem
              icon="🎯"
              text="Personalized recommendations for better health"
              iconBackgroundColor="bg-secondary"
            />

            <FeatureItem
              icon="📈"
              text="Comprehensive reports for your next doctor's visit"
              iconBackgroundColor="bg-accent"
              containerClassName="flex-row items-center bg-white/50 rounded-xl p-4"
            />
          </View>
        </View>

        {/* Call to Action Section */}
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
    </ScreenContainer>
  );
}
