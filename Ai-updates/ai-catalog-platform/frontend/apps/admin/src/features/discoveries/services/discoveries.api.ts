import { request } from '@/lib/api-client';
import type { Discovery } from '../types';

export const discoveriesApi = {
  getAll: (params?: { search?: string; industrySlug?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.industrySlug) qs.set('industrySlug', params.industrySlug);
    const q = qs.toString();
    return request<Discovery[]>(`/discoveries${q ? `?${q}` : ''}`);
  },

  getById: (id: string) =>
    request<Discovery>(`/discoveries/${id}`),

  create: (data: Partial<Discovery>) =>
    request<Discovery>('/discoveries', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<Discovery>) =>
    request<Discovery>(`/discoveries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/discoveries/${id}`, { method: 'DELETE' }),

  togglePublish: (id: string) =>
    request<Discovery>(`/discoveries/${id}/publish`, { method: 'POST' }),

  addLink: (id: string, link: { type: string; name: string; description?: string; redirectUrl?: string }) =>
    request<any>(`/discoveries/${id}/links`, { method: 'POST', body: JSON.stringify(link) }),

  removeLink: (id: string, linkId: string) =>
    request<void>(`/discoveries/${id}/links/${linkId}`, { method: 'DELETE' }),
};
