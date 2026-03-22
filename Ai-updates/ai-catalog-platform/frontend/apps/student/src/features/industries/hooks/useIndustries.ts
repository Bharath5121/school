'use client';

import { useState, useEffect } from 'react';
import { industriesApi } from '../services/industries.api';
import type { Industry } from '../types/industry.types';

export function useIndustries() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    industriesApi
      .getAll()
      .then((data) => {
        if (!cancelled) setIndustries(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { industries, loading, error };
}
