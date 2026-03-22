'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export interface FieldOption {
  slug: string;
  name: string;
}

export function useFields() {
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<FieldOption[]>('/home/industries')
      .then((res) => {
        if (!cancelled) setFields(Array.isArray(res) ? res : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { fields, loading };
}
