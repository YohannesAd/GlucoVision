import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

/**
 * FieldPicker - Reusable picker component for onboarding forms
 * 
 * Features:
 * - Modal-based selection
 * - Customizable options
 * - Consistent styling
 * - Professional appearance
 */

interface Option {
  value: string;
  label: string;
}

interface FieldPickerProps {
  label: string;
  subtitle?: string;
  placeholder: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
  containerClassName?: string;
}

export default function FieldPicker({
  label,
  subtitle,
  placeholder,
  value,
  options,
  onSelect,
  containerClassName = 'mb-6',
}: FieldPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    setShowPicker(false);
  };

  const getDisplayValue = () => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  };

  return (
    <View className={containerClassName}>
      <Text className="text-textPrimary font-medium mb-2">{label}</Text>
      {subtitle && (
        <Text className="text-textSecondary text-sm mb-3">{subtitle}</Text>
      )}

      <TouchableOpacity
        className="bg-white border border-gray-200 rounded-xl px-4 py-3"
        onPress={() => setShowPicker(true)}
      >
        <Text className="text-textPrimary font-medium">
          {getDisplayValue()}
        </Text>
      </TouchableOpacity>

      {/* Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-textPrimary">{label}</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text className="text-primary font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`py-3 px-4 rounded-lg mb-2 ${
                    value === option.value ? 'bg-primary' : 'bg-gray-50'
                  }`}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text className={`text-center font-medium ${
                    value === option.value ? 'text-white' : 'text-textPrimary'
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
