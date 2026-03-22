import { request } from '@/lib/api-client';
import type { TrendingCategory, TrendingApp } from '../types';

export const trendingApi = {
  getCategories: () => request<TrendingCategory[]>('/trending-apps/categories'),
  getCategory: (id: string) => request<TrendingCategory>(`/trending-apps/categories/${id}`),
  createCategory: (data: Partial<TrendingCategory>) =>
    request<TrendingCategory>('/trending-apps/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: Partial<TrendingCategory>) =>
    request<TrendingCategory>(`/trending-apps/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) =>
    request<void>(`/trending-apps/categories/${id}`, { method: 'DELETE' }),

  getApps: () => request<TrendingApp[]>('/trending-apps/apps'),
  getApp: (id: string) => request<TrendingApp>(`/trending-apps/apps/${id}`),
  createApp: (data: Partial<TrendingApp>) =>
    request<TrendingApp>('/trending-apps/apps', { method: 'POST', body: JSON.stringify(data) }),
  updateApp: (id: string, data: Partial<TrendingApp>) =>
    request<TrendingApp>(`/trending-apps/apps/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApp: (id: string) =>
    request<void>(`/trending-apps/apps/${id}`, { method: 'DELETE' }),
};
