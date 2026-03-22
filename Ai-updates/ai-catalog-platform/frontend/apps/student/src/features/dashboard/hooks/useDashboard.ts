import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app.store';
import { supabase } from '@/lib/supabase';

export function useDashboard<T = unknown>(role: string) {
  const { user } = useAppStore();
  const isParentView = user?.role === 'PARENT';
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) { setLoading(false); return; }

        const r = await fetch(`/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await r.json();
        if (!cancelled) setData(res.data ?? res);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  return { data, loading, error, user, isParentView };
}
