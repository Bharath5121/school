import { request } from '@/lib/api-client';
import { API_URL } from '@/lib/config';
import { useAppStore } from '@/store/app.store';
import type { User } from '../types';

async function paginatedRequest<T>(path: string): Promise<{ data: T[]; total: number; page: number; limit: number }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = useAppStore.getState().accessToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { credentials: 'include', headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return { data: json.data ?? [], total: json.meta?.total ?? 0, page: json.meta?.page ?? 1, limit: json.meta?.limit ?? 20 };
}

export const usersApi = {
  getAll: async (page = 1, limit = 20, role?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.set('role', role);
    const result = await paginatedRequest<User>(`/users?${params}`);
    return { users: result.data, total: result.total, page: result.page, limit: result.limit };
  },
  get: (id: string) => request<User>(`/users/${id}`),
  updateRole: (id: string, role: string) =>
    request<User>(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  delete: (id: string) =>
    request<void>(`/users/${id}`, { method: 'DELETE' }),
};
