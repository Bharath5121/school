'use client';

import { useState, useEffect } from 'react';
import { discoveryApi } from '../services/discovery.api';
import type { DiscoveryDetail } from '../types';

export function useDiscoveryDetail(slug: string) {
  const [discovery, setDiscovery] = useState<DiscoveryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await discoveryApi.getBySlug(slug);
        if (!cancelled) setDiscovery(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load discovery');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { discovery, loading, error };
}
