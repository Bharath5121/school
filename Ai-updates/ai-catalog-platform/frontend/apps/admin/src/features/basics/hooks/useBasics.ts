'use client';

import { useState, useEffect, useCallback } from 'react';
import { basicsApi } from '../services/basics.api';
import type { BasicsTopic } from '../types';

interface UseBasicsReturn {
  items: BasicsTopic[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (p: number) => void;
  refresh: () => void;
  deleteItem: (id: string) => Promise<void>;
}

export function useBasics(): UseBasicsReturn {
  const [items, setItems] = useState<BasicsTopic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await basicsApi.getTopics();
        if (!cancelled) {
          setItems(data);
          setTotal(data.length);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load basics topics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [page, refreshKey]);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const deleteItem = useCallback(async (id: string) => {
    const prev = items;
    setItems(items.filter(i => i.id !== id));
    try {
      await basicsApi.deleteTopic(id);
      refresh();
    } catch {
      setItems(prev);
      throw new Error('Failed to delete basics topic');
    }
  }, [items, refresh]);

  return { items, total, loading, error, page, setPage, refresh, deleteItem };
}
