'use client';

import { useState, useEffect } from 'react';
import { industriesApi } from '../services/industries.api';
import type { IndustryDetail } from '../types/industry.types';

export function useIndustryDetail(slug: string) {
  const [industry, setIndustry] = useState<IndustryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    industriesApi
      .getBySlug(slug)
      .then((data) => {
        if (!cancelled) setIndustry(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { industry, loading, error };
}
