import { supabase } from '@/lib/supabase';
import type { TrendingCategorySummary, TrendingCategoryDetail, TrendingAppSummary, TrendingAppDetail, MyAppsResponse } from '../types/trending.types';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export const trendingApi = {
  async getCategories(): Promise<TrendingCategorySummary[]> {
    const res = await fetch(`${API}/trending-apps/categories`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getCategoryBySlug(slug: string): Promise<TrendingCategoryDetail | null> {
    const res = await fetch(`${API}/trending-apps/categories/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async getByIndustry(industrySlug: string): Promise<TrendingAppSummary[]> {
    const res = await fetch(`${API}/trending-apps/by-industry/${industrySlug}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getMyApps(): Promise<MyAppsResponse> {
    const res = await fetch(`${API}/trending-apps/my-apps`, { headers: await authHeaders() });
    if (!res.ok) return { industries: [], apps: [] };
    const json = await res.json();
    return json.data || { industries: [], apps: [] };
  },

  async getAppDetail(slug: string): Promise<TrendingAppDetail | null> {
    const res = await fetch(`${API}/trending-apps/app/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
