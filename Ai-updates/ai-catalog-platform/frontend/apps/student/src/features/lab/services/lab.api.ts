import { supabase } from '@/lib/supabase';
import type { LabCategorySummary, LabCategoryDetail, LabItemDetail, LabChatMsg } from '../types/lab.types';

const API = '/api';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export const labApi = {
  async getCategories(): Promise<LabCategorySummary[]> {
    const res = await fetch(`${API}/lab/categories`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getCategoryBySlug(slug: string): Promise<LabCategoryDetail | null> {
    const res = await fetch(`${API}/lab/categories/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async getItemBySlug(slug: string): Promise<LabItemDetail | null> {
    const res = await fetch(`${API}/lab/items/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async getChatMessages(itemSlug: string): Promise<LabChatMsg[]> {
    const res = await fetch(`${API}/lab/items/${itemSlug}/chat`, {
      headers: await authHeaders(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async sendChatMessage(itemSlug: string, message: string): Promise<LabChatMsg | null> {
    const res = await fetch(`${API}/lab/items/${itemSlug}/chat`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
