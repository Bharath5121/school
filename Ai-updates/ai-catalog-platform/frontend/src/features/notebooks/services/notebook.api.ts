import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';

function getHeaders(): HeadersInit {
  const token = useAppStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  const json = await res.json();
  if (!res.ok) {
    const error = new Error(json.message || 'Request failed') as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  return json.data;
}

export interface NotebookAccess {
  notebookId: string;
  title: string;
  description: string | null;
  industryName: string;
  workspaceSlug: string;
}

export interface NotebookHistoryEntry {
  id: string;
  accessedAt: string;
  notebook: {
    id: string;
    title: string;
    category: string;
    industrySlug: string;
    workspaceSlug: string | null;
    gradeLevel: string | null;
    difficultyLevel: string | null;
    sourcesCount: number;
    industry: { name: string; icon: string; color: string };
  };
}

export const notebookApi = {
  getAccess: (industrySlug: string, category: string) =>
    request<NotebookAccess>(`/notebooks/${industrySlug}/${category}`),

  logOpen: (notebookId: string) =>
    request<{ logged: boolean }>('/notebooks/log-open', {
      method: 'POST',
      body: JSON.stringify({ notebookId }),
    }),

  getHistory: () =>
    request<NotebookHistoryEntry[]>('/notebooks/my-history'),

  getPublished: (params?: { gradeLevel?: string; difficultyLevel?: string }) => {
    const qs = new URLSearchParams();
    if (params?.gradeLevel) qs.set('gradeLevel', params.gradeLevel);
    if (params?.difficultyLevel) qs.set('difficultyLevel', params.difficultyLevel);
    const q = qs.toString();
    return request<any[]>(`/notebooks/published${q ? `?${q}` : ''}`);
  },

  getPublishedByCategory: (category: string) =>
    request<any[]>(`/notebooks/published/${category}`),

  sendChat: (notebookId: string, message: string) =>
    request<{ text: string; sources: any[] }>(`/notebooks/${notebookId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getChatHistory: (notebookId: string) =>
    request<any[]>(`/notebooks/${notebookId}/chat-history`),

  clearChatHistory: (notebookId: string) =>
    request<void>(`/notebooks/${notebookId}/chat-history`, { method: 'DELETE' }),

  checkHealth: () =>
    request<{ anythingllm: string }>('/notebooks/health'),
};
