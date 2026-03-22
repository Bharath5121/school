'use client';

import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../services/users.api';
import type { User } from '../types';

interface UseUsersReturn {
  items: User[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (p: number) => void;
  refresh: () => void;
  deleteItem: (id: string) => Promise<void>;
  changeRole: (id: string, role: string) => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [items, setItems] = useState<User[]>([]);
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
        const res = await usersApi.getAll(page, 20);
        if (!cancelled) {
          setItems(res.users);
          setTotal(res.total);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load users');
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
      await usersApi.delete(id);
      refresh();
    } catch {
      setItems(prev);
      throw new Error('Failed to delete user');
    }
  }, [items, refresh]);

  const changeRole = useCallback(async (id: string, role: string) => {
    await usersApi.updateRole(id, role);
    refresh();
  }, [refresh]);

  return { items, total, loading, error, page, setPage, refresh, deleteItem, changeRole };
}
