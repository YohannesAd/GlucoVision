import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Button from '../buttons/Button';

/**
 * DateTimePicker Component
 * 
 * Professional date and time picker for glucose readings
 * Allows users to select when their reading was taken
 * 
 * Features:
 * - Date selection (recent dates)
 * - Time selection (hours and minutes)
 * - Professional modal interface
 * - Easy to use for medical logging
 */

interface DateTimePickerProps {
  label: string;
  subtitle?: string;
  value: Date;
  onDateTimeChange: (date: Date) => void;
  className?: string;
}

export default function DateTimePicker({
  label,
  subtitle,
  value,
  onDateTimeChange,
  className = ''
}: DateTimePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  // Generate recent dates (last 7 days)
  const generateRecentDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    return dates;
  };

  // Generate hours (12-hour format)
  const generateHours = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(i);
    }
    return hours;
  };

  // Generate minutes (every 5 minutes)
  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i);
    }
    return minutes;
  };

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatDisplayTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDateSelect = (date: Date) => {
    const newDateTime = new Date(selectedDate);
    newDateTime.setFullYear(date.getFullYear());
    newDateTime.setMonth(date.getMonth());
    newDateTime.setDate(date.getDate());
    setSelectedDate(newDateTime);
  };

  const handleTimeSelect = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const newDateTime = new Date(selectedDate);
    let adjustedHour = hour;
    
    if (period === 'PM' && hour !== 12) {
      adjustedHour += 12;
    } else if (period === 'AM' && hour === 12) {
      adjustedHour = 0;
    }
    
    newDateTime.setHours(adjustedHour);
    newDateTime.setMinutes(minute);
    setSelectedDate(newDateTime);
  };

  const handleSave = () => {
    onDateTimeChange(selectedDate);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedDate(value);
    setIsModalVisible(false);
  };

  return (
    <View className={className}>
      {/* Label */}
      <Text className="text-textPrimary font-medium mb-2">{label}</Text>
      {subtitle && (
        <Text className="text-textSecondary text-sm mb-3">{subtitle}</Text>
      )}

      {/* DateTime Display Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-textPrimary font-medium">
            {formatDisplayDate(value)} at {formatDisplayTime(value)}
          </Text>
          <Text className="text-textSecondary text-lg">📅</Text>
        </View>
      </TouchableOpacity>

      {/* DateTime Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 bg-gray-900 bg-opacity-30 justify-end">
          <View className="bg-white rounded-t-xl max-h-96 shadow-xl">
            {/* Modal Header */}
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-darkBlue text-center">
                Select Date & Time
              </Text>
            </View>

            <ScrollView className="max-h-80 px-6 py-4">
              {/* Date Selection */}
              <Text className="text-textPrimary font-medium mb-3">Date</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {generateRecentDates().map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDateSelect(date)}
                    className={`px-4 py-2 rounded-lg border ${
                      date.toDateString() === selectedDate.toDateString()
                        ? 'bg-primary border-primary'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      date.toDateString() === selectedDate.toDateString()
                        ? 'text-white'
                        : 'text-textPrimary'
                    }`}>
                      {formatDisplayDate(date)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Time Selection */}
              <Text className="text-textPrimary font-medium mb-3">Time</Text>
              <View className="flex-row items-center justify-center gap-2 mb-4">
                {/* Hour */}
                <View className="flex-1">
                  <Text className="text-center text-sm text-textSecondary mb-2">Hour</Text>
                  <ScrollView className="max-h-32" showsVerticalScrollIndicator={false}>
                    {generateHours().map((hour) => (
                      <TouchableOpacity
                        key={hour}
                        onPress={() => {
                          const currentHour = selectedDate.getHours();
                          const period = currentHour >= 12 ? 'PM' : 'AM';
                          handleTimeSelect(hour, selectedDate.getMinutes(), period);
                        }}
                        className="py-2"
                      >
                        <Text className="text-center text-textPrimary">{hour}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text className="text-textPrimary text-lg">:</Text>

                {/* Minute */}
                <View className="flex-1">
                  <Text className="text-center text-sm text-textSecondary mb-2">Min</Text>
                  <ScrollView className="max-h-32" showsVerticalScrollIndicator={false}>
                    {generateMinutes().map((minute) => (
                      <TouchableOpacity
                        key={minute}
                        onPress={() => {
                          const currentHour = selectedDate.getHours();
                          const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
                          const period = currentHour >= 12 ? 'PM' : 'AM';
                          handleTimeSelect(displayHour, minute, period);
                        }}
                        className="py-2"
                      >
                        <Text className="text-center text-textPrimary">
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* AM/PM */}
                <View className="flex-1">
                  <Text className="text-center text-sm text-textSecondary mb-2">Period</Text>
                  <View className="gap-2">
                    {['AM', 'PM'].map((period) => (
                      <TouchableOpacity
                        key={period}
                        onPress={() => {
                          const currentHour = selectedDate.getHours();
                          const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
                          handleTimeSelect(displayHour, selectedDate.getMinutes(), period as 'AM' | 'PM');
                        }}
                        className="py-2"
                      >
                        <Text className="text-center text-textPrimary">{period}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Current Selection Display */}
              <View className="bg-blue-50 rounded-lg p-3 mb-4">
                <Text className="text-center text-primary font-medium">
                  {formatDisplayDate(selectedDate)} at {formatDisplayTime(selectedDate)}
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View className="px-6 py-4 border-t border-gray-200 flex-row gap-3">
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                size="medium"
                className="flex-1"
              />
              <Button
                title="Save"
                onPress={handleSave}
                variant="primary"
                size="medium"
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
