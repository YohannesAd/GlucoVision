import { useState, useEffect, useCallback } from 'react';

/**
 * useDataFetching Hook
 */

interface UseDataFetchingProps<T> {
  fetchFunction: () => Promise<T>;
  dependencies?: any[];
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseDataFetchingReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export function useDataFetching<T>({
  fetchFunction,
  dependencies = [],
  immediate = true,
  onSuccess,
  onError
}: UseDataFetchingProps<T>): UseDataFetchingReturn<T> {
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error('Data fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);

  // Auto-fetch on mount
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate]); // Removed fetchData to prevent loops

  // Separate effect for dependencies to ensure proper triggering
  useEffect(() => {
    if (immediate && dependencies.length > 0) {
      fetchData();
    }
  }, dependencies);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    clearError
  };
}
