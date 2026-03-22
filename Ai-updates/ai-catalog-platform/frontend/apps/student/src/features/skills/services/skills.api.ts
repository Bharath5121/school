import { supabase } from '@/lib/supabase';
import type { SkillSummary, MySkillsResponse } from '../types/skills.types';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const skillsApi = {
  async getMySkills(): Promise<MySkillsResponse> {
    const res = await fetch(`${API}/skills/my-skills`, { headers: await authHeaders() });
    if (!res.ok) return { industries: [], skills: [] };
    const json = await res.json();
    return json.data || { industries: [], skills: [] };
  },

  async getSkillDetail(id: string): Promise<SkillSummary | null> {
    const res = await fetch(`${API}/skills/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
