import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Platform } from 'react-native';
import { ScreenContainer, Button, FeatureItem } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * LandingScreen - App introduction 
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
      <ScrollView
        className="flex-1 bg-softBlue"
        style={[styles.container, Platform.OS === 'web' && styles.webContainer]}
        contentContainerStyle={[
          { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 },
          Platform.OS === 'web' && styles.webContentContainer
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Branding Section */}
        <View className="items-center mb-8 pt-5" style={[styles.brandingSection]}>
          {/* App Logo */}
          <View className="bg-white rounded-full p-6 shadow-lg mb-4" style={[styles.logoContainer]}>
            <Image
              source={require('../../../assets/logo.png')}
              className="w-16 h-16"
              style={[styles.logo]}
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text className="text-3xl font-bold text-darkBlue mb-2" style={[styles.appName]}>
            GlucoVision
          </Text>

          {/* App Tagline */}
          <Text className="text-base text-textSecondary font-medium text-center" style={[styles.tagline]}>
            Track smarter. Live healthier.
          </Text>
        </View>

        {/* Content Section */}
        <View className="flex-1 justify-center py-5" style={[styles.contentSection]}>
          {/* App Description */}
          <Text className="text-center text-textPrimary text-sm leading-relaxed mb-6 px-4" style={[styles.description]}>
            Take control of your diabetes with AI-powered insights and personalized tracking.
          </Text>

          {/* Key Features List */}
          <View className="w-full" style={[styles.featuresContainer]}>
            <FeatureItem
              icon="📊"
              text="Smart glucose tracking with AI chat box assistance"
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
            />
          </View>
        </View>

        {/* Call to Action Section */}
        <View className="w-full mt-8 pb-5" style={[styles.ctaSection]}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Add displayName for debugging
LandingScreen.displayName = 'LandingScreen';

// Fallback styles for web compatibility
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    backgroundColor: '#EBF4FF',
  },
  webContentContainer: {
    minHeight: '100vh',
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  description: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    width: '100%',
  },
  ctaSection: {
    width: '100%',
    marginTop: 32,
    paddingBottom: 20,
  },
});
