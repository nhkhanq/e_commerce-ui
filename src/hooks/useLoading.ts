import { useState, useCallback } from "react";

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useLoading = (initialLoading: boolean = false): LoadingState => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear error when starting new operation
    }
  }, []);

  const setErrorState = useCallback((error: string | null) => {
    setError(error);
    if (error) {
      setIsLoading(false); // Stop loading when error occurs
    }
  }, []);

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await asyncFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setErrorState(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setLoading, setErrorState]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    setLoading,
    setError: setErrorState,
    withLoading,
    reset,
  };
}; 