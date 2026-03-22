'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { useDashboard } from '../hooks/useDashboard';
import { Compass, BookOpen, FlaskConical } from 'lucide-react';

interface StudentDashboardData {
  user: {
    name: string;
    interests: string[];
    gradeLevel: string | null;
  };
}

export const StudentDashboard = () => {
  const { user: authUser } = useAppStore();
  const { data, loading } = useDashboard<StudentDashboardData>('student');

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayName = authUser?.name || data?.user?.name || 'Student';

  return (
    <div className="space-y-12">

      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 shadow-lg shadow-emerald-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-emerald-100 text-sm mt-1.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <Link href="/discoveries">
            <div className="group p-6 rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-blue-100/50 dark:bg-blue-500/[0.06] shadow-sm hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-400/60 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Compass size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Discoveries</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">Explore real-world AI use cases across industries.</p>
            </div>
          </Link>

          <Link href="/basics">
            <div className="group p-6 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-100/50 dark:bg-emerald-500/[0.06] shadow-sm hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-400/60 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <BookOpen size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">AI Basics</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">Learn the fundamentals of artificial intelligence.</p>
            </div>
          </Link>

          <Link href="/lab">
            <div className="group p-6 rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-100/50 dark:bg-violet-500/[0.06] shadow-sm hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-400/60 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <FlaskConical size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">AI Lab</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">Explore AI models, agents, and tools hands-on.</p>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
};
