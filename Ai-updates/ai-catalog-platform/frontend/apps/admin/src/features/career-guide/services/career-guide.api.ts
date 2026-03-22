import { request } from '@/lib/api-client';
import type { CareerGuide } from '../types';

export const careerGuideApi = {
  getGuides: () => request<CareerGuide[]>('/career-guide/guides'),
  getGuide: (id: string) => request<CareerGuide>(`/career-guide/guides/${id}`),
  createGuide: (data: Partial<CareerGuide>) =>
    request<CareerGuide>('/career-guide/guides', { method: 'POST', body: JSON.stringify(data) }),
  updateGuide: (id: string, data: Partial<CareerGuide>) =>
    request<CareerGuide>(`/career-guide/guides/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGuide: (id: string) =>
    request<void>(`/career-guide/guides/${id}`, { method: 'DELETE' }),
};
