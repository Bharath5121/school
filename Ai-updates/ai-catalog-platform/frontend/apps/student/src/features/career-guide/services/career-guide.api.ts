import { supabase } from '@/lib/supabase';
import type { CareerGuideSummary, MyGuidesResponse } from '../types/career-guide.types';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const careerGuideApi = {
  async getMyGuides(): Promise<MyGuidesResponse> {
    const res = await fetch(`${API}/career-guide/my-guides`, { headers: await authHeaders() });
    if (!res.ok) return { industries: [], guides: [] };
    const json = await res.json();
    return json.data || { industries: [], guides: [] };
  },

  async getGuideDetail(id: string): Promise<CareerGuideSummary | null> {
    const res = await fetch(`${API}/career-guide/guides/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
