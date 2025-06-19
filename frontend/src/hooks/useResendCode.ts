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

  // Timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle resend code
  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      const result = await request({
        endpoint: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: 'POST',
        data: { email },
        showErrorAlert: false
      });

      if (result.success) {
        setResendTimer(initialTimer);
        setCanResend(false);
        if (resetForm) resetForm();
      }
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  return {
    canResend,
    resendTimer,
    handleResendCode
  };
}
