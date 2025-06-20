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

function ResendCodeSection({
  canResend,
  resendTimer,
  onResend,
  isLoading = false,
  className = ''
}: ResendCodeSectionProps) {
  // Safety checks
  if (typeof canResend !== 'boolean' || typeof resendTimer !== 'number' || typeof onResend !== 'function') {
    console.warn('ResendCodeSection: Invalid props provided');
    return null;
  }

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
          Resend code in {Math.max(0, resendTimer)} seconds
        </Text>
      )}
    </View>
  );
}

// Add displayName for debugging
ResendCodeSection.displayName = 'ResendCodeSection';

export default ResendCodeSection;
