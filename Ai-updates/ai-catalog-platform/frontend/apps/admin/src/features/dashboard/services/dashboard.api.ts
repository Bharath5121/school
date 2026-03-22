import { request } from '@/lib/api-client';
import type { ContentStats, DashboardSummary } from '../types';

export const dashboardApi = {
  getContentStats: () => request<ContentStats>('/dashboard/stats'),
  getDashboard: () => request<DashboardSummary>('/dashboard'),
};
