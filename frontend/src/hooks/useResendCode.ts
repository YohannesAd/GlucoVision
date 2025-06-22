import { useState, useEffect } from 'react';
import { useAPI, API_ENDPOINTS } from './useAPI';

/**
 * useResendCode - Reusable hook for resend code functionality
 * Handles timer and resend logic for verification screens
 */

interface UseResendCodeProps {
  email: string;
  resetForm?: () => void;
  initialTimer?: number;
}

interface UseResendCodeReturn {
  canResend: boolean;
  resendTimer: number;
  handleResendCode: () => Promise<void>;
}

export function useResendCode({
  email,
  resetForm,
  initialTimer = 60
}: UseResendCodeProps): UseResendCodeReturn {
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(initialTimer);
  const { request } = useAPI();

  // Timer effect with proper cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    // Cleanup function
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [resendTimer]);

  // Handle resend code with enhanced error handling
  const handleResendCode = async () => {
    if (!canResend) {
      console.warn('useResendCode: Cannot resend code yet');
      return;
    }

    if (!email) {
      console.error('useResendCode: Email is required for resending code');
      return;
    }

    try {
      const result = await request({
        endpoint: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: 'POST',
        data: { email },
        showErrorAlert: true,
        successMessage: 'New verification code sent to your email'
      });

      if (result && result.success) {
        setResendTimer(initialTimer);
        setCanResend(false);
        if (resetForm && typeof resetForm === 'function') {
          resetForm();
        }
      } else {
        console.error('useResendCode: Failed to resend code:', result?.error);
      }
    } catch (error: any) {
      console.error('useResendCode: Error resending code:', error);
      // Error is already handled by useAPI hook with showErrorAlert: true
    }
  };

  return {
    canResend,
    resendTimer,
    handleResendCode
  };
}
