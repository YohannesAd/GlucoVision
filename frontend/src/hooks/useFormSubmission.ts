import { useState } from 'react';
import { Alert } from 'react-native';

/**
 * useFormSubmission Hook 
 * Provides consistent loading states, error handling, and success feedback
 */

interface UseFormSubmissionProps<T> {
  onSubmit: (data: T) => Promise<void>;
  successMessage?: string;
  successTitle?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  resetForm?: () => void;
  showSuccessAlert?: boolean;
}

interface UseFormSubmissionReturn<T> {
  isLoading: boolean;
  error: string | null;
  handleSubmit: (data: T) => Promise<void>;
  clearError: () => void;
}

export function useFormSubmission<T>({
  onSubmit,
  successMessage = 'Operation completed successfully!',
  successTitle = 'Success!',
  onSuccess,
  onError,
  resetForm,
  showSuccessAlert = true
}: UseFormSubmissionProps<T>): UseFormSubmissionReturn<T> {
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate onSubmit function
      if (typeof onSubmit !== 'function') {
        throw new Error('Invalid form submission handler');
      }

      await onSubmit(data);

      setIsLoading(false);

      if (showSuccessAlert) {
        Alert.alert(
          successTitle,
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                try {
                  if (resetForm && typeof resetForm === 'function') {
                    resetForm();
                  }
                  if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess();
                  }
                } catch (callbackError) {
                  console.error('useFormSubmission: Error in success callbacks:', callbackError);
                }
              }
            }
          ]
        );
      } else {
        try {
          if (resetForm && typeof resetForm === 'function') {
            resetForm();
          }
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess();
          }
        } catch (callbackError) {
          console.error('useFormSubmission: Error in success callbacks:', callbackError);
        }
      }

    } catch (err: any) {
      setIsLoading(false);

      // Enhanced error message handling
      let errorMessage = 'An unexpected error occurred';

      if (err && typeof err === 'object') {
        if (err.message && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
      }

      setError(errorMessage);

      try {
        if (onError && typeof onError === 'function') {
          onError(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      } catch (errorCallbackError) {
        console.error('useFormSubmission: Error in error callback:', errorCallbackError);
        // Fallback alert
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    handleSubmit,
    clearError
  };
}
