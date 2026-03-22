'use client';

import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { API_URL } from '@/lib/config';

export interface FieldOption {
  slug: string;
  name: string;
  icon: string;
}

interface FieldsStore {
  fields: FieldOption[];
  fetchedAt: number | null;
  setFields: (fields: FieldOption[]) => void;
  clear: () => void;
}

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useFieldsStore = create<FieldsStore>((set) => ({
  fields: [],
  fetchedAt: null,
  setFields: (fields) => set({ fields, fetchedAt: Date.now() }),
  clear: () => set({ fields: [], fetchedAt: null }),
}));

export function useFields() {
  const { fields: cached, fetchedAt, setFields: setCached } = useFieldsStore();
  const [fields, setFields] = useState<FieldOption[]>(cached);
  const [loading, setLoading] = useState(cached.length === 0);

  useEffect(() => {
    const isStale = !fetchedAt || Date.now() - fetchedAt > STALE_TIME;
    if (cached.length > 0 && !isStale) {
      setFields(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchFields = async () => {
      try {
        const res = await fetch(`${API_URL}/home/industries`);
        if (!res.ok) throw new Error(`Fields fetch failed: ${res.status}`);
        const json = await res.json();
        const data: FieldOption[] = (json.data || []).map((i: any) => ({
          slug: i.slug,
          name: i.name,
          icon: i.icon || '',
        }));
        if (!cancelled) {
          setCached(data);
          setFields(data);
        }
      } catch {
        if (!cancelled && cached.length > 0) {
          setFields(cached);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFields();
    return () => { cancelled = true; };
  }, [fetchedAt, cached, setCached]);

  const invalidate = useCallback(() => {
    useFieldsStore.getState().clear();
  }, []);

  return { fields, loading, invalidate };
}

export function invalidateFields() {
  useFieldsStore.getState().clear();
}
