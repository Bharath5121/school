'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import {
  Users, Globe, Box, Bot, AppWindow, BookOpen, Video, FileText
} from 'lucide-react';

interface ContentStats {
  industries: number;
  models: number;
  agents: number;
  apps: number;
  questions: number;
  basicsTopics: number;
  basicsVideos: number;
  basicsArticles: number;
}

interface UserStats {
  totalUsers: number;
  roles: Record<string, number>;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [content, setContent] = useState<ContentStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getContentStats().catch(() => null),
      adminApi.getDashboard().catch(() => null),
    ]).then(([c, u]) => {
      setContent(c);
      setUserStats(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-slate-500 dark:text-slate-400">Loading dashboard...</div>;
  }

  const contentCards = content ? [
    { label: 'Industries', value: content.industries, icon: Globe, color: 'text-blue-400' },
    { label: 'AI Models', value: content.models, icon: Box, color: 'text-violet-400' },
    { label: 'AI Agents', value: content.agents, icon: Bot, color: 'text-emerald-400' },
    { label: 'Apps', value: content.apps, icon: AppWindow, color: 'text-pink-400' },
    { label: 'Basics Topics', value: content.basicsTopics, icon: BookOpen, color: 'text-cyan-400' },
    { label: 'Videos', value: content.basicsVideos, icon: Video, color: 'text-orange-400' },
    { label: 'Articles', value: content.basicsArticles, icon: FileText, color: 'text-rose-400' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Stats */}
      {userStats && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Users</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-4">
              <Users size={20} className="text-emerald-400 mb-2" />
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
              <div className="text-xs text-slate-600 dark:text-slate-500">Total Users</div>
            </div>
            {Object.entries(userStats.roles).map(([role, count]) => (
              <div key={role} className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-4">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-slate-600 dark:text-slate-500">{role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Stats */}
      {content && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Content</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentCards.map((card) => (
              <div key={card.label} className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-4">
                <card.icon size={20} className={`${card.color} mb-2`} />
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-xs text-slate-600 dark:text-slate-500">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Users */}
      {userStats?.recentUsers && (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent Registrations</h2>
          <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700/40 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Email</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Role</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {userStats.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200 dark:border-slate-700/20 last:border-0">
                    <td className="px-4 py-3 text-sm">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
