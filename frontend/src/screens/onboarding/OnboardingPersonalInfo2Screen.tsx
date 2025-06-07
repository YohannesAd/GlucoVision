import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { ScreenContainer, FormContainer, ScreenHeader, FormInput, Button, ProgressIndicator } from '../../components/ui';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * OnboardingPersonalInfo2Screen - Second step of onboarding
 * 
 * Collects medical information:
 * - Diabetes type (Type 1, Type 2, Gestational, Other)
 * - Diagnosis date
 * - Current medications (pills/insulin)
 * - Doctor information
 * 
 * This information is crucial for providing accurate AI recommendations
 * and understanding the user's medical context.
 */

type OnboardingPersonalInfo2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingPersonalInfo2'>;

interface OnboardingPersonalInfo2ScreenProps {
  navigation: OnboardingPersonalInfo2ScreenNavigationProp;
}

export default function OnboardingPersonalInfo2Screen({ navigation }: OnboardingPersonalInfo2ScreenProps) {
  // Form state
  const [diabetesType, setDiabetesType] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [takesInsulin, setTakesInsulin] = useState<boolean | null>(null);
  const [takesPills, setTakesPills] = useState<boolean | null>(null);
  const [currentMedications, setCurrentMedications] = useState('');
  const [doctorName, setDoctorName] = useState('');

  // Diabetes type options
  const diabetesTypes = [
    { value: 'type1', label: 'Type 1 Diabetes' },
    { value: 'type2', label: 'Type 2 Diabetes' },
    { value: 'gestational', label: 'Gestational Diabetes' },
    { value: 'other', label: 'Other/Pre-diabetes' },
  ];

  // Handle diabetes type selection
  const handleDiabetesTypeSelect = (type: string) => {
    setDiabetesType(type);
  };

  // Handle form submission and navigation to next step
  const handleNext = () => {
    // Basic validation
    if (!diabetesType || !diagnosisDate || takesInsulin === null || takesPills === null) {
      Alert.alert('Required Fields', 'Please fill in all required fields to continue.');
      return;
    }

    // TODO: Save data to context or storage
    // const medicalInfo = { 
    //   diabetesType, 
    //   diagnosisDate, 
    //   takesInsulin, 
    //   takesPills, 
    //   currentMedications, 
    //   doctorName 
    // };
    
    // Navigate to next onboarding step
    navigation.navigate('OnboardingPersonalInfo3');
  };

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <FormContainer>
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={2} totalSteps={3} />

        {/* Screen Header */}
        <ScreenHeader
          title="Medical Information"
          subtitle="Help us understand your diabetes management"
          containerClassName="items-center mb-6"
        />

        {/* Medical Information Form */}
        <View className="mb-6">
          {/* Diabetes Type Selection */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">Diabetes Type *</Text>
            <View className="space-y-2">
              {diabetesTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => handleDiabetesTypeSelect(type.value)}
                  className={`p-3 rounded-xl border ${
                    diabetesType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Text className={`font-medium ${
                    diabetesType === type.value ? 'text-primary' : 'text-textPrimary'
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Diagnosis Date */}
          <FormInput
            label="When were you diagnosed? *"
            placeholder="MM/YYYY or Year"
            value={diagnosisDate}
            onChangeText={setDiagnosisDate}
            keyboardType="numeric"
          />

          {/* Insulin Question */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">Do you take insulin? *</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setTakesInsulin(true)}
                className={`flex-1 p-3 rounded-xl border ${
                  takesInsulin === true
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  takesInsulin === true ? 'text-primary' : 'text-textPrimary'
                }`}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTakesInsulin(false)}
                className={`flex-1 p-3 rounded-xl border ${
                  takesInsulin === false
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  takesInsulin === false ? 'text-primary' : 'text-textPrimary'
                }`}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pills Question */}
          <View className="mb-4">
            <Text className="text-textPrimary font-medium mb-2">Do you take diabetes pills/medication? *</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setTakesPills(true)}
                className={`flex-1 p-3 rounded-xl border ${
                  takesPills === true
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  takesPills === true ? 'text-primary' : 'text-textPrimary'
                }`}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTakesPills(false)}
                className={`flex-1 p-3 rounded-xl border ${
                  takesPills === false
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Text className={`text-center font-medium ${
                  takesPills === false ? 'text-primary' : 'text-textPrimary'
                }`}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Medications */}
          <FormInput
            label="Current Medications"
            placeholder="(Optional) List your current medications"
            value={currentMedications}
            onChangeText={setCurrentMedications}
            multiline
            numberOfLines={3}
          />

          {/* Doctor Information */}
          <FormInput
            label="Primary Doctor"
            placeholder="(Optional) Doctor's name"
            value={doctorName}
            onChangeText={setDoctorName}
            containerClassName="mb-6"
          />

          {/* Navigation Buttons */}
          <View className="flex-row space-x-3">
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              size="large"
              style={{ flex: 1 }}
            />
            <Button
              title="Continue"
              onPress={handleNext}
              variant="primary"
              size="large"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Step Information */}
        <Text className="text-center text-textSecondary text-sm">
          Step 2 of 3 - Medical Information
        </Text>
      </FormContainer>
    </ScreenContainer>
  );
}
