import { supabase } from '@/lib/supabase';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export interface SavedItem {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  title: string;
  url: string | null;
  metadata: any;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  title: string;
  slug: string | null;
  icon: string | null;
  metadata: any;
  viewedAt: string;
}

export const myStuffApi = {
  async getSavedItems(): Promise<SavedItem[]> {
    const res = await fetch(`${API}/my-stuff/saved`, { headers: await authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async checkSaved(contentType: string, contentId: string): Promise<boolean> {
    const res = await fetch(`${API}/my-stuff/saved/check/${contentType}/${contentId}`, { headers: await authHeaders() });
    if (!res.ok) return false;
    const json = await res.json();
    return json.data?.saved || false;
  },

  async saveItem(data: { contentType: string; contentId: string; title: string; url?: string; metadata?: any }): Promise<SavedItem | null> {
    const res = await fetch(`${API}/my-stuff/saved`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async unsaveItem(contentType: string, contentId: string): Promise<void> {
    await fetch(`${API}/my-stuff/saved/${contentType}/${contentId}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
  },

  async getHistory(limit = 50): Promise<HistoryItem[]> {
    const res = await fetch(`${API}/my-stuff/history?limit=${limit}`, { headers: await authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async trackView(data: { contentType: string; contentId: string; title: string; slug?: string; icon?: string; metadata?: any }): Promise<void> {
    await fetch(`${API}/my-stuff/history`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data),
    }).catch(() => {});
  },

  async clearHistory(): Promise<void> {
    await fetch(`${API}/my-stuff/history`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
  },

  async getCounts(): Promise<{ savedCount: number; historyCount: number }> {
    const res = await fetch(`${API}/my-stuff/counts`, { headers: await authHeaders() });
    if (!res.ok) return { savedCount: 0, historyCount: 0 };
    const json = await res.json();
    return json.data || { savedCount: 0, historyCount: 0 };
  },
};
