import { API_URL } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import type { DiscoveryCard, DiscoveryDetail, ChatMessage } from '../types';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const discoveryApi = {
  list: (params?: { featured?: boolean; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.featured !== undefined) qs.set('featured', String(params.featured));
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const q = qs.toString();
    return apiFetch<DiscoveryCard[]>(`/discoveries${q ? `?${q}` : ''}`);
  },

  getBySlug: (slug: string) =>
    apiFetch<DiscoveryDetail>(`/discoveries/${slug}`),

  getChatMessages: (slug: string) =>
    apiFetch<ChatMessage[]>(`/discoveries/${slug}/chat`),

  postChatMessage: (slug: string, message: string) =>
    apiFetch<ChatMessage>(`/discoveries/${slug}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
