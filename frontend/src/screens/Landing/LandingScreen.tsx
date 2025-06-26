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
      backgroundColor="#EBF4FF"
      statusBarBackgroundColor="#EBF4FF"
    >
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={[styles.contentContainer]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Branding Section */}
        <View style={[styles.brandingSection]}>
          {/* App Logo */}
          <View style={[styles.logoContainer]}>
            <Image
              source={require('../../../assets/logo.png')}
              style={[styles.logo]}
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text style={[styles.appName]}>
            GlucoVision
          </Text>

          {/* App Tagline */}
          <Text style={[styles.tagline]}>
            Track smarter. Live healthier.
          </Text>
        </View>

        {/* Content Section */}
        <View style={[styles.contentSection]}>
          {/* App Description */}
          <Text style={[styles.description]}>
            Take control of your diabetes with AI-powered insights and personalized tracking.
          </Text>

          {/* Key Features List */}
          <View style={[styles.featuresContainer]}>
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
        <View style={[styles.ctaSection]}>
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

// Styles for web compatibility
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF4FF',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
    }),
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
