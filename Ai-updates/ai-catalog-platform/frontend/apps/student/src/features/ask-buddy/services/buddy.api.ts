import { supabase } from '@/lib/supabase';

const API = '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export interface BuddyConversation {
  id: string;
  title: string;
  context: string | null;
  model: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: BuddyMessage[];
}

export interface BuddyMessage {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  metadata: any;
  createdAt: string;
}

export const buddyApi = {
  async getConversations(): Promise<BuddyConversation[]> {
    const res = await fetch(`${API}/buddy/conversations`, { headers: await authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async createConversation(title?: string, context?: string): Promise<BuddyConversation | null> {
    const res = await fetch(`${API}/buddy/conversations`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ title, context }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async getMessages(conversationId: string): Promise<BuddyMessage[]> {
    const res = await fetch(`${API}/buddy/conversations/${conversationId}/messages`, { headers: await authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  async sendMessage(conversationId: string, content: string): Promise<{ userMessage: BuddyMessage; assistantMessage: BuddyMessage } | null> {
    const res = await fetch(`${API}/buddy/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },

  async deleteConversation(id: string): Promise<void> {
    await fetch(`${API}/buddy/conversations/${id}`, {
      method: 'DELETE',
      headers: await authHeaders(),
    });
  },
};
