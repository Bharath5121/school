import { supabase } from '@/lib/supabase';
import type { MyCareerResponse, CareerJobDetail } from '../types/career.types';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export const careerApi = {
  async getMyPaths(): Promise<MyCareerResponse> {
    const res = await fetch(`${API}/career-map/my-paths`, { headers: await authHeaders() });
    if (!res.ok) return { industries: [], paths: [] };
    const json = await res.json();
    return json.data || { industries: [], paths: [] };
  },

  async getJobDetail(id: string): Promise<CareerJobDetail | null> {
    const res = await fetch(`${API}/career-map/jobs/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
