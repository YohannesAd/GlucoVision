import { useState, useEffect } from 'react';

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
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
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
