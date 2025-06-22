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
  // Enhanced safety checks with error boundaries
  if (typeof canResend !== 'boolean') {
    console.warn('ResendCodeSection: canResend must be boolean, received:', typeof canResend);
    return null;
  }

  if (typeof resendTimer !== 'number' || isNaN(resendTimer)) {
    console.warn('ResendCodeSection: resendTimer must be a valid number, received:', resendTimer);
    return null;
  }

  if (typeof onResend !== 'function') {
    console.warn('ResendCodeSection: onResend must be a function, received:', typeof onResend);
    return null;
  }

  // Safe timer calculation
  const safeTimer = Math.max(0, Math.floor(resendTimer));

  // Safe onPress handler
  const handleResend = () => {
    try {
      if (typeof onResend === 'function') {
        onResend();
      }
    } catch (error) {
      console.error('ResendCodeSection: Error calling onResend:', error);
    }
  };

  return (
    <View className={`items-center mb-6 ${className}`}>
      {canResend ? (
        <Button
          title="Resend Code"
          onPress={handleResend}
          variant="outline"
          size="medium"
          disabled={isLoading}
        />
      ) : (
        <Text className="text-textSecondary text-sm">
          Resend code in {safeTimer} seconds
        </Text>
      )}
    </View>
  );
}

// Add displayName for debugging
ResendCodeSection.displayName = 'ResendCodeSection';

export default ResendCodeSection;
