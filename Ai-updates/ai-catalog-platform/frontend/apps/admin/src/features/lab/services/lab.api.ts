import { request } from '@/lib/api-client';
import type { LabCategory, LabItem } from '../types';

export const labApi = {
  getCategories: () => request<LabCategory[]>('/lab/categories'),
  getCategory: (id: string) => request<LabCategory>(`/lab/categories/${id}`),
  createCategory: (data: Partial<LabCategory>) =>
    request<LabCategory>('/lab/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<LabCategory>) =>
    request<LabCategory>(`/lab/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    request<void>(`/lab/categories/${id}`, { method: 'DELETE' }),

  getItems: () => request<LabItem[]>('/lab/items'),
  getItem: (id: string) => request<LabItem>(`/lab/items/${id}`),
  createItem: (data: Partial<LabItem>) =>
    request<LabItem>('/lab/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: Partial<LabItem>) =>
    request<LabItem>(`/lab/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: string) =>
    request<void>(`/lab/items/${id}`, { method: 'DELETE' }),
};
