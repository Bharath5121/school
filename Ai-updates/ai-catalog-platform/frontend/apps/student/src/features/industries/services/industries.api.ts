import { API_URL } from '@/lib/config';
import type { Industry, IndustryDetail } from '../types/industry.types';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json.data;
}

export const industriesApi = {
  getAll: () => apiFetch<Industry[]>('/industries'),
  getBySlug: (slug: string) => apiFetch<IndustryDetail>(`/industries/${slug}`),
};
