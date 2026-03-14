'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';
import { logger } from '@/lib/logger';

interface UseApiCallOptions {
  auth?: boolean;
}

interface UseApiCallResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiCall<T>(
  url: string | null,
  options: UseApiCallOptions = {}
): UseApiCallResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAppStore((s) => s.accessToken);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {};
      if (options.auth && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      const res = await fetch(fullUrl, { headers });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || `Request failed (${res.status})`);
      }

      const json = await res.json();
      setData(json.data ?? json);
    } catch (err: any) {
      logger.error(`API call failed: ${url}`, err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url, accessToken, options.auth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
