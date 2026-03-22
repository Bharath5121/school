import { supabase } from '@/lib/supabase';
import type { BasicsChapter, BasicsTopicSummary, BasicsTopicDetail, BasicsTopicChatMsg } from '../types/basics.types';

const API_BASE = '/api';

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

export const basicsApi = {
  async getChapters(): Promise<BasicsChapter[]> {
    const res = await fetch(`${API_BASE}/basics/chapters`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getTopics(): Promise<BasicsTopicSummary[]> {
    const res = await fetch(`${API_BASE}/basics/topics`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async getTopicDetail(slug: string): Promise<BasicsTopicDetail | null> {
    const res = await fetch(`${API_BASE}/basics/topics/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async getChatMessages(slug: string): Promise<BasicsTopicChatMsg[]> {
    const res = await fetch(`${API_BASE}/basics/topics/${slug}/chat`, {
      headers: await authHeaders(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async sendChatMessage(slug: string, message: string): Promise<BasicsTopicChatMsg | null> {
    const res = await fetch(`${API_BASE}/basics/topics/${slug}/chat`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
