'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';

export interface FieldOption {
  slug: string;
  name: string;
  icon: string;
}

let cachedFields: FieldOption[] | null = null;

export function useFields() {
  const [fields, setFields] = useState<FieldOption[]>(cachedFields || []);
  const [loading, setLoading] = useState(!cachedFields);

  useEffect(() => {
    if (cachedFields) return;

    const fetchFields = async () => {
      try {
        const res = await fetch(`${API_URL}/home/industries`);
        const json = await res.json();
        const data: FieldOption[] = (json.data || []).map((i: any) => ({
          slug: i.slug,
          name: i.name,
          icon: i.icon,
        }));
        cachedFields = data;
        setFields(data);
      } catch {
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  return { fields, loading };
}
