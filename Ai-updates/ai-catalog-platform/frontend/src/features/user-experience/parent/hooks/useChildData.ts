import { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppStore } from '@/store/app.store';

export function useChildData<T>(childId: string, endpoint: string, params?: Record<string, string>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAppStore();

  const paramStr = useMemo(() => params ? new URLSearchParams(params).toString() : '', [JSON.stringify(params)]);

  const fetchData = useCallback(async () => {
    if (!accessToken || !childId) { setLoading(false); return; }
    try {
      setLoading(true);
      const qs = paramStr ? `?${paramStr}` : '';
      const res = await fetch(`/api/parent/child/${childId}/${endpoint}${qs}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, childId, endpoint, paramStr]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useParentApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAppStore();

  useEffect(() => {
    if (!accessToken) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/parent/${endpoint}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, endpoint]);

  return { data, loading, error };
}
