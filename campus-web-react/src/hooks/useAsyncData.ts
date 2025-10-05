import { useState, useEffect, useCallback } from 'react';

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook לניהול טעינת נתונים אסינכרונית
 * מספק מצבי טעינה, שגיאה ופונקציית רענון
 */
export const useAsyncData = <T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה לא ידועה';
      setError(errorMessage);
      console.error('Error in useAsyncData:', err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook לטעינת נתונים עם אפשרות לעדכון ידני
 */
export const useAsyncDataWithManual = <T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncDataResult<T> & { setData: (data: T) => void } => {
  const asyncResult = useAsyncData(fetchFn, dependencies);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (asyncResult.data) {
      setData(asyncResult.data);
    }
  }, [asyncResult.data]);

  return {
    ...asyncResult,
    data,
    setData,
  };
};
