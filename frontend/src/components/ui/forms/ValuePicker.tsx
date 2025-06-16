import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Button from '../buttons/Button';

/**
 * ValuePicker Component
 * 
 * Professional picker component for selecting values from a list
 * Replaces problematic input fields with reliable picker interface
 * 
 * Used in:
 * - AddLogScreen (glucose value selection)
 * - OnboardingScreens (various value selections)
 * - AccountScreen (preference selections)
 * - Any screen needing value selection
 */

interface ValuePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function ValuePicker({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select a value",
  error,
  disabled = false,
  className = ''
}: ValuePickerProps) {
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsModalVisible(false);
  };

  return (
    <View className={className}>
      {/* Label */}
      <Text className="text-textPrimary font-medium mb-2">
        {label}
      </Text>

      {/* Picker Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        className={`border rounded-lg p-4 ${
          error 
            ? 'border-error bg-red-50' 
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 bg-white'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <Text className={`${
            selectedOption 
              ? 'text-textPrimary' 
              : 'text-textSecondary'
          }`}>
            {displayText}
          </Text>
          <Text className="text-textSecondary text-lg">
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <Text className="text-error text-sm mt-1">
          {error}
        </Text>
      )}

      {/* Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-gray-900 bg-opacity-30 justify-end">
          <View className="bg-white rounded-t-xl max-h-96 shadow-xl">
            {/* Modal Header */}
            <View className="px-6 py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-darkBlue">
                  Select {label}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  className="p-2"
                >
                  <Text className="text-textSecondary text-lg">✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Options List */}
            <ScrollView className="max-h-80">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  className={`px-6 py-4 border-b border-gray-100 ${
                    option.value === value ? 'bg-blue-50' : ''
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base ${
                      option.value === value 
                        ? 'text-primary font-medium' 
                        : 'text-textPrimary'
                    }`}>
                      {option.label}
                    </Text>
                    {option.value === value && (
                      <Text className="text-primary text-lg">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Modal Footer */}
            <View className="px-6 py-4">
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                variant="outline"
                size="medium"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
