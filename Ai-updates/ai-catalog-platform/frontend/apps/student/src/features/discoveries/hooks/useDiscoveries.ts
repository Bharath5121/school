'use client';

import { useState, useEffect } from 'react';
import { discoveryApi } from '../services/discovery.api';
import type { DiscoveryCard } from '../types';

export function useDiscoveries() {
  const [featured, setFeatured] = useState<DiscoveryCard[]>([]);
  const [all, setAll] = useState<DiscoveryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [featuredData, allData] = await Promise.all([
          discoveryApi.list({ featured: true }),
          discoveryApi.list(),
        ]);
        if (!cancelled) {
          setFeatured(Array.isArray(featuredData) ? featuredData : []);
          setAll(Array.isArray(allData) ? allData : []);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load discoveries');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { featured, all, loading, error };
}
