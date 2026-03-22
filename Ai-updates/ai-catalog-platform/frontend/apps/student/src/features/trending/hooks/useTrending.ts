'use client';

import { useState, useEffect } from 'react';
import { trendingApi } from '../services/trending.api';
import type { TrendingCategorySummary, TrendingAppSummary, TrendingAppDetail, MyAppsResponse } from '../types/trending.types';

export function useTrendingCategories() {
  const [categories, setCategories] = useState<TrendingCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trendingApi.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

export function useTrendingByIndustry(industrySlug: string) {
  const [apps, setApps] = useState<TrendingAppSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!industrySlug) return;
    setLoading(true);
    trendingApi.getByIndustry(industrySlug)
      .then(setApps)
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [industrySlug]);

  return { apps, loading };
}

export function useMyApps() {
  const [data, setData] = useState<MyAppsResponse>({ industries: [], apps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trendingApi.getMyApps()
      .then(setData)
      .catch(() => setData({ industries: [], apps: [] }))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}

export function useAppDetail(slug: string) {
  const [app, setApp] = useState<TrendingAppDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    trendingApi.getAppDetail(slug)
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return { app, loading };
}
