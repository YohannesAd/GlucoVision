/**
 * Password Toggle Demo Component
 * =============================
 * 
 * Demo component to showcase the password visibility toggle feature.
 * This can be used for testing and demonstration purposes.
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import FormInput from './FormInput';

export default function PasswordToggleDemo() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View className="p-6 bg-white">
      <Text className="text-xl font-bold text-textPrimary mb-6 text-center">
        Password Toggle Demo
      </Text>
      
      <FormInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <FormInput
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <Text className="text-sm text-textSecondary text-center mt-4">
        👁️ Tap the eye icon to toggle password visibility
      </Text>
    </View>
  );
}
