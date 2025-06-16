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
                if (resetForm) resetForm();
                if (onSuccess) onSuccess();
              }
            }
          ]
        );
      } else {
        if (resetForm) resetForm();
        if (onSuccess) onSuccess();
      }
      
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      } else {
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
