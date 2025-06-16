/**
 * Network Test Component
 * ======================
 * 
 * Debug component to test network connectivity to the backend.
 * Helps troubleshoot API connection issues.
 */

import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from '../ui/index';
import { API_CONFIG } from '../../services/api/config';

export default function NetworkTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setLastResult('Testing...');

    try {
      console.log('🔍 Testing connection to:', `${API_CONFIG.BASE_URL}/health`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);

      setLastResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
      Alert.alert('Success!', 'Backend connection is working');

    } catch (error: any) {
      console.error('❌ Network test error:', error);
      const errorMessage = error.message || 'Unknown error';
      setLastResult(`❌ Error: ${errorMessage}`);
      Alert.alert('Connection Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testForgotPassword = async () => {
    setIsLoading(true);
    setLastResult('Testing forgot password...');

    try {
      console.log('🔍 Testing forgot password:', `${API_CONFIG.BASE_URL}/api/v1/auth/forgot-password`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📡 Response data:', data);

      if (!response.ok) {
        setLastResult(`❌ HTTP ${response.status}: ${JSON.stringify(data, null, 2)}`);
      } else {
        setLastResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
      }

    } catch (error: any) {
      console.error('❌ Forgot password test error:', error);
      const errorMessage = error.message || 'Unknown error';
      setLastResult(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 bg-white border border-gray-200 rounded-xl m-4">
      <Text className="text-lg font-bold text-textPrimary mb-4">
        🔧 Network Debug Tool
      </Text>
      
      <Text className="text-sm text-textSecondary mb-4">
        API Base URL: {API_CONFIG.BASE_URL}
      </Text>

      <View className="space-y-2 mb-4">
        <Button
          title={isLoading ? "Testing..." : "Test Health Endpoint"}
          onPress={testConnection}
          variant="outline"
          size="medium"
          disabled={isLoading}
        />
        
        <Button
          title={isLoading ? "Testing..." : "Test Forgot Password"}
          onPress={testForgotPassword}
          variant="outline"
          size="medium"
          disabled={isLoading}
        />
      </View>

      {lastResult && (
        <View className="bg-gray-50 p-3 rounded-lg">
          <Text className="text-xs text-textSecondary font-mono">
            {lastResult}
          </Text>
        </View>
      )}
    </View>
  );
}
