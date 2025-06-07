import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, ProgressIndicator } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * OnboardingPersonalInfo1Screen - First step of onboarding
 *
 * Collects basic personal information:
 * - Full name
 * - Date of birth
 * - Gender
 * - Phone number (optional)
 *
 * This information helps personalize the app experience and
 * provides context for health recommendations.
 */

type OnboardingPersonalInfo1ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo1'>;

interface OnboardingPersonalInfo1ScreenProps {
  navigation: OnboardingPersonalInfo1ScreenNavigationProp;
}

export default function OnboardingPersonalInfo1Screen({ navigation }: OnboardingPersonalInfo1ScreenProps) {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Handle form submission and navigation to next step
  const handleNext = () => {
    // Basic validation
    if (!firstName || !lastName || !dateOfBirth || !gender) {
      Alert.alert('Required Fields', 'Please fill in all required fields to continue.');
      return;
    }

    // TODO: Save data to context or storage
    // const personalInfo1 = { firstName, lastName, dateOfBirth, gender, phoneNumber };

    // Navigate to next onboarding step
    navigation.navigate('OnboardingPersonalInfo2');
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={1} totalSteps={3} />

        {/* Screen Header */}
        <ScreenHeader
          title="Personal Information"
          subtitle="Help us get to know you better"
          containerClassName="items-center mb-6"
        />

        {/* Personal Information Form */}
        <View className="mb-6">
          {/* Name Inputs Row */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <FormInput
                label="First Name *"
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                containerClassName="mb-0"
              />
            </View>

            <View className="flex-1 ml-2">
              <FormInput
                label="Last Name *"
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                containerClassName="mb-0"
              />
            </View>
          </View>

          {/* Date of Birth Input */}
          <FormInput
            label="Date of Birth *"
            placeholder="MM/DD/YYYY"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
          />

          {/* Gender Input */}
          <FormInput
            label="Gender *"
            placeholder="Select gender"
            value={gender}
            onChangeText={setGender}
          />

          {/* Phone Number Input (Optional) */}
          <FormInput
            label="Phone Number"
            placeholder="(Optional) Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            containerClassName="mb-6"
          />

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleNext}
            variant="primary"
            size="large"
            style={{ width: '100%' }}
          />
        </View>

        {/* Step Information */}
        <Text className="text-center text-textSecondary text-sm">
          Step 1 of 3 - Personal Information
        </Text>
      </FormContainer>
    </ScreenContainer>
  );
}
