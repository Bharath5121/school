import { request } from '@/lib/api-client';
import type { Industry } from '../types';

export const industriesApi = {
  getAll: () => request<Industry[]>('/industries'),
  getById: (id: string) => request<Industry>(`/industries/${id}`),
  create: (data: Partial<Industry>) =>
    request<Industry>('/industries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Industry>) =>
    request<Industry>(`/industries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/industries/${id}`, { method: 'DELETE' }),
};
