'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { useDashboard } from '../../hooks/useDashboard';
import { Users, TrendingUp, BookOpen, Briefcase } from 'lucide-react';

interface TeacherData {
  teacher: { name: string; gradeLevel: string | null; studentCount: number };
  classInterests: { field: string; count: number; percentage: number }[];
  topContent: { id: string; title: string; field: string; type: string }[];
}

const TYPE_CONFIG: Record<string, { gradient: string; label: string; tint: string; border: string }> = {
  MODEL: { gradient: 'from-violet-500 to-purple-600', label: 'Model', tint: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20' },
  AGENT: { gradient: 'from-emerald-500 to-teal-600', label: 'Agent', tint: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20' },
  APP: { gradient: 'from-amber-500 to-orange-600', label: 'App', tint: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20' },
};

const INTEREST_COLORS = [
  { bar: 'from-amber-400 to-orange-500', bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
  { bar: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
  { bar: 'from-blue-400 to-indigo-500', bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
  { bar: 'from-violet-400 to-purple-500', bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20', text: 'text-violet-600 dark:text-violet-400' },
  { bar: 'from-rose-400 to-pink-500', bg: 'bg-rose-100/60 dark:bg-rose-500/[0.06]', border: 'border-rose-200 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400' },
];

export const TeacherDashboard = () => {
  const { user: authUser } = useAppStore();
  const { data, loading, error } = useDashboard<TeacherData>('teacher');

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8">
        <p className="text-red-600 dark:text-red-400 text-lg font-bold">Something went wrong</p>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Failed to load dashboard data.</p>
      </div>
    </div>
  );
  if (!data) return null;

  const displayName = authUser?.name || data.teacher.name;

  return (
    <div className="space-y-12">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 shadow-lg shadow-emerald-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-emerald-100 text-sm mt-1.5">
            {data.teacher.gradeLevel || 'Teacher'} &middot; {data.teacher.studentCount} students on platform &middot; {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative overflow-hidden p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-emerald-500" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.teacher.studentCount}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden p-5 rounded-2xl bg-amber-100/60 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-amber-500" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{data.classInterests.length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500">Industries Explored</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden p-5 rounded-2xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-blue-500" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{data.topContent.length}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500">Latest Content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Interest Distribution */}
      {data.classInterests.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">
            Student Interest Distribution
          </h2>
          <div className="p-6 rounded-2xl bg-slate-50/60 dark:bg-slate-500/[0.03] border border-gray-100 dark:border-slate-700/40 shadow-sm space-y-5">
            {data.classInterests.map((interest, i) => {
              const color = INTEREST_COLORS[i % INTEREST_COLORS.length];
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{interest.field}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${color.text}`}>{interest.count} students</span>
                      <span className="text-xs font-extrabold text-gray-400 dark:text-slate-600">{interest.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${color.bar} h-full rounded-full transition-all duration-700 shadow-sm`}
                      style={{ width: `${Math.max(interest.percentage, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Content */}
      {data.topContent.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">
            Latest Platform Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.topContent.map(content => {
              const cfg = TYPE_CONFIG[content.type] || TYPE_CONFIG.MODEL;
              return (
                <Link key={content.id} href={`/explore/${content.field}`}>
                  <div className={`group p-5 rounded-2xl border ${cfg.border} ${cfg.tint} shadow-sm hover:shadow-lg transition-all duration-300 h-full`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} text-white`}>{cfg.label}</span>
                      <span className="text-[10px] font-medium text-gray-400 dark:text-slate-600 capitalize">{content.field}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-auto">
                      <Briefcase size={12} />
                      <span>View in Explore</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/industries">
            <div className="group p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-100/60 dark:bg-emerald-500/[0.06] shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-1">Explore Industries</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Browse AI tools, models, and careers across all industries</p>
            </div>
          </Link>
          <Link href="/trending">
            <div className="group p-6 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-100/60 dark:bg-amber-500/[0.06] shadow-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1">Trending Apps</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">See what AI tools and apps are trending this month</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Empty state */}
      {data.classInterests.length === 0 && data.topContent.length === 0 && (
        <section className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🏫</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Dashboard Coming Alive</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">As students join and content is added by admins, your classroom insights will appear here.</p>
        </section>
      )}
    </div>
  );
};
