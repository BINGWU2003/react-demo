import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  successMessage?: string;
}

export function useApi<T = unknown, P = unknown>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = '操作成功',
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (params: P) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(params);
        setState({
          data: result,
          loading: false,
          error: null,
        });

        if (showSuccessMessage) {
          message.success(successMessage);
        }

        return result;
      } catch (error) {
        const err = error as Error;
        setState({
          data: null,
          loading: false,
          error: err,
        });

        if (showErrorMessage) {
          message.error(err.message || '操作失败');
        }

        throw error;
      }
    },
    [apiFunction, showSuccessMessage, showErrorMessage, successMessage]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// 简化版Hook，只用于获取数据
export function useApiData<T = unknown>(
  apiFunction: () => Promise<T>,
  immediate = false
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      message.error(error.message || '获取数据失败');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  // 立即执行
  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, [fetch, immediate]);

  return {
    data,
    loading,
    error,
    fetch,
    refetch: fetch,
  };
} 