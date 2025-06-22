/**
 * Password Reset Flow Test Utility
 * 
 * This utility helps test the password reset flow and error handling
 * to ensure the app doesn't crash when codes expire or errors occur.
 */

export interface PasswordResetTestResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Test forgot password request
 */
export const testForgotPassword = async (email: string): Promise<PasswordResetTestResult> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `Verification code sent to ${data.email || email}`,
      };
    } else {
      return {
        success: false,
        message: 'Failed to send verification code',
        error: data.detail || 'Unknown error',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error occurred',
      error: error.message || 'Connection failed',
    };
  }
};

/**
 * Test verification code validation
 */
export const testVerifyCode = async (
  email: string, 
  code: string
): Promise<PasswordResetTestResult> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/verify-reset-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        verification_code: code 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Verification code is valid',
      };
    } else {
      return {
        success: false,
        message: 'Invalid verification code',
        error: data.detail || 'Code verification failed',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Network error occurred',
      error: error.message || 'Connection failed',
    };
  }
};

/**
 * Test common error scenarios
 */
export const testErrorScenarios = {
  expiredCode: () => testVerifyCode('test@example.com', '000000'),
  invalidCode: () => testVerifyCode('test@example.com', '123456'),
  invalidEmail: () => testForgotPassword('invalid-email'),
  nonExistentEmail: () => testForgotPassword('nonexistent@example.com'),
};

/**
 * Validate error handling in components
 */
export const validateErrorHandling = {
  checkDisplayName: (component: any) => {
    try {
      return component.displayName !== undefined;
    } catch (error) {
      console.error('DisplayName check failed:', error);
      return false;
    }
  },
  
  checkProps: (props: any, requiredProps: string[]) => {
    const missing = requiredProps.filter(prop => props[prop] === undefined);
    return {
      valid: missing.length === 0,
      missing,
    };
  },
};

export default {
  testForgotPassword,
  testVerifyCode,
  testErrorScenarios,
  validateErrorHandling,
};
