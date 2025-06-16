import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../buttons/Button';

/**
 * ResendCodeSection - Reusable resend code functionality
 * Used in verification screens to reduce code duplication
 */

interface ResendCodeSectionProps {
  canResend: boolean;
  resendTimer: number;
  onResend: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function ResendCodeSection({
  canResend,
  resendTimer,
  onResend,
  isLoading = false,
  className = ''
}: ResendCodeSectionProps) {
  return (
    <View className={`items-center mb-6 ${className}`}>
      {canResend ? (
        <Button
          title="Resend Code"
          onPress={onResend}
          variant="outline"
          size="medium"
          disabled={isLoading}
        />
      ) : (
        <Text className="text-textSecondary text-sm">
          Resend code in {resendTimer} seconds
        </Text>
      )}
    </View>
  );
}
