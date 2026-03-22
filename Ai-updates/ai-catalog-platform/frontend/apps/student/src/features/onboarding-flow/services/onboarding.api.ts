import { supabase } from '@/lib/supabase';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export interface OnboardingIndustry {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface OnboardingStatus {
  onboardingCompleted: boolean;
  selectedIndustries: {
    industrySlug: string;
    industry: { name: string; slug: string; icon: string; color: string };
  }[];
}

export const onboardingApi = {
  async getIndustries(): Promise<OnboardingIndustry[]> {
    const res = await fetch(`${API}/onboarding/industries`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getStatus(): Promise<OnboardingStatus | null> {
    const res = await fetch(`${API}/onboarding/status`, { headers: await authHeaders() });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async complete(industrySlugs: string[]): Promise<OnboardingStatus | null> {
    const res = await fetch(`${API}/onboarding/complete`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ industrySlugs }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
