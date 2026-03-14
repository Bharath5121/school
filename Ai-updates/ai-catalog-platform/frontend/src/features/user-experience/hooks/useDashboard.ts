import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/app.store';

export const useDashboard = <T>(role: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAppStore();

  const fetchDashboard = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const apiPath = role.toLowerCase();
      const response = await fetch(`/api/${apiPath}/dashboard/summary`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [role, accessToken]);

  useEffect(() => {
    if (role) fetchDashboard();
  }, [role, fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
};
