import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList, GlucoseLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useGlucose } from '../../context/GlucoseContext';
import { ScreenContainer, FormInput, Button } from '../../components/ui';

/**
 * AddLogScreen - Add new glucose reading
 * 
 * Features:
 * - Glucose value input with picker (avoiding input field issues)
 * - Meal context selection (fasting, before meal, after meal, bedtime)
 * - Date and time selection (defaults to current)
 * - Optional notes field
 * - Unit preference from user settings
 * - Form validation and error handling
 * - Integration with GlucoseContext for data persistence
 * - Professional medical app design
 * 
 * Accessible from:
 * - Hamburger menu "Add Log"
 * - Dashboard "Add Blood Sugar Reading" button
 * - Recent readings "Add New Reading" button
 */

type AddLogScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddLog'>;

interface AddLogScreenProps {
  navigation: AddLogScreenNavigationProp;
}

export default function AddLogScreen({ navigation }: AddLogScreenProps) {
  const { state } = useAuth();
  const { user, token } = state;
  const { addLog } = useGlucose();

  // Form state
  const [glucoseValue, setGlucoseValue] = useState('');
  const [mealContext, setMealContext] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showValuePicker, setShowValuePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Get user's preferred glucose unit
  const glucoseUnit = user?.preferences?.glucoseUnit || 'mg/dL';

  // Glucose value options (mg/dL) - same as onboarding
  const glucoseOptions = [];
  for (let i = 50; i <= 500; i += 5) {
    glucoseOptions.push({ value: i.toString(), label: `${i} mg/dL` });
  }

  // Meal context options
  const mealContextOptions = [
    { value: 'fasting', label: 'Fasting' },
    { value: 'before_meal', label: 'Before Meal' },
    { value: 'after_meal', label: 'After Meal' },
    { value: 'bedtime', label: 'Bedtime' },
    { value: 'random', label: 'Random' },
  ];

  // Handle glucose value selection
  const handleValueSelect = (value: string) => {
    setGlucoseValue(value);
    setShowValuePicker(false);
  };

  // Handle meal context selection
  const handleMealContextSelect = (context: string) => {
    setMealContext(context);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Validate form
  const validateForm = () => {
    if (!glucoseValue) {
      Alert.alert('Required Field', 'Please select a glucose value.');
      return false;
    }
    if (!mealContext) {
      Alert.alert('Required Field', 'Please select when this reading was taken.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSaveLog = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create new glucose log
      const newLog: Omit<GlucoseLog, 'id' | 'createdAt'> = {
        userId: user?.id || '',
        value: parseInt(glucoseValue),
        unit: glucoseUnit,
        logType: mealContext as 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random',
        notes: notes.trim() || undefined,
        timestamp: selectedDate.toISOString(),
      };

      // Save the log using GlucoseContext
      if (!token) {
        throw new Error('No authentication token');
      }
      await addLog(newLog, token);

      setIsLoading(false);

      Alert.alert(
        'Success!',
        'Your glucose reading has been saved successfully.',
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setGlucoseValue('');
              setMealContext('');
              setSelectedDate(new Date());
              setNotes('');
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Save glucose log error:', error);
      Alert.alert('Error', 'Failed to save glucose reading. Please try again.');
    }
  };

  // Handle date/time change
  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Text className="text-darkBlue text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkBlue">Add Glucose Reading</Text>
          <View className="w-12" />
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Form Container */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          
          {/* Glucose Value */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-2">
              Glucose Value *
            </Text>
            <Text className="text-textSecondary text-sm mb-3">
              Select your blood sugar reading
            </Text>
            <TouchableOpacity
              onPress={() => setShowValuePicker(true)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4"
            >
              <Text className={`text-lg font-medium ${
                glucoseValue ? 'text-darkBlue' : 'text-textSecondary'
              }`}>
                {glucoseValue ? `${glucoseValue} ${glucoseUnit}` : `Select glucose value (${glucoseUnit})`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Meal Context */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-2">
              When was this taken? *
            </Text>
            <Text className="text-textSecondary text-sm mb-3">
              Select the timing of your reading
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {mealContextOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleMealContextSelect(option.value)}
                  className={`flex-1 min-w-[45%] py-3 px-4 rounded-xl border ${
                    mealContext === option.value
                      ? 'bg-primary border-primary'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    mealContext === option.value ? 'text-white' : 'text-darkBlue'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-2">
              Date & Time
            </Text>
            <Text className="text-textSecondary text-sm mb-3">
              When was this reading taken?
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-darkBlue font-medium text-base">
                    {formatDate(selectedDate)}
                  </Text>
                  <Text className="text-textSecondary text-sm">
                    {formatTime(selectedDate)}
                  </Text>
                </View>
                <Text className="text-textSecondary">📅</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Notes (Optional) */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-2">
              Notes (Optional)
            </Text>
            <Text className="text-textSecondary text-sm mb-3">
              Add any additional context or observations
            </Text>
            <FormInput
              label=""
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g., Feeling tired, after exercise, before medication..."
              multiline
              numberOfLines={3}
              containerClassName="mb-0"
              inputClassName="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-darkBlue min-h-[80px]"
            />
          </View>

          {/* Save Button */}
          <Button
            title={isLoading ? "Saving..." : "Save Reading"}
            onPress={handleSaveLog}
            variant="primary"
            size="large"
            disabled={isLoading}
          />
        </View>

        {/* Help Text */}
        <View className="mx-4 mt-4 p-4 bg-lightBlue rounded-xl">
          <Text className="text-darkBlue font-medium mb-2">💡 Tips for accurate readings:</Text>
          <Text className="text-darkBlue text-sm leading-5">
            • Wash your hands before testing{'\n'}
            • Use the side of your fingertip{'\n'}
            • Record readings at consistent times{'\n'}
            • Note any factors that might affect your levels
          </Text>
        </View>
      </ScrollView>

      {/* Glucose Value Picker Modal */}
      <Modal
        visible={showValuePicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-textPrimary">Select Glucose Value</Text>
              <TouchableOpacity onPress={() => setShowValuePicker(false)}>
                <Text className="text-primary font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {glucoseOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`py-3 px-4 rounded-lg mb-2 ${
                    glucoseValue === option.value ? 'bg-primary' : 'bg-gray-50'
                  }`}
                  onPress={() => handleValueSelect(option.value)}
                >
                  <Text className={`text-center font-medium ${
                    glucoseValue === option.value ? 'text-white' : 'text-textPrimary'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Time Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimeChange}
          maximumDate={new Date()}
        />
      )}
    </ScreenContainer>
  );
}
