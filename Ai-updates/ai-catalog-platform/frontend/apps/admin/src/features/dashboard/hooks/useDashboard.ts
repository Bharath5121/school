'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/dashboard.api';
import type { ContentStats, DashboardSummary } from '../types';

interface DashboardStats {
  totalUsers: number;
  totalContent: number;
  recentActivity: unknown[];
  contentStats: ContentStats | null;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [summary, contentStats] = await Promise.all([
          dashboardApi.getDashboard(),
          dashboardApi.getContentStats(),
        ]);
        if (!cancelled) {
          setStats({
            totalUsers: summary.totalUsers,
            totalContent: summary.totalContent,
            recentActivity: summary.recentActivity,
            contentStats,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
