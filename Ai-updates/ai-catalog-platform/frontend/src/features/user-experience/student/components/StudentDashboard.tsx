'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { useDashboard } from '../../hooks/useDashboard';
import { notebookApi, NotebookHistoryEntry } from '@/features/notebooks/services/notebook.api';
import { BookOpen, ExternalLink, Clock, MessageCircle } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';

interface StudentDashboardData {
  user: {
    name: string;
    interests: string[];
    gradeLevel: string | null;
  };
  topStory: any;
  trending: any[];
  fieldFeeds: any;
  recentFeed: any[];
}

interface FieldStat {
  name: string;
  slug: string;
  icon: string;
  color: string;
  _count: { models: number; agents: number; apps: number };
}

interface TrendingApp {
  id: string;
  title: string;
  type: string;
  field: string;
  fieldSlug: string;
  fieldIcon: string;
  careerImpact: string;
  tryUrl?: string;
  builtBy?: string;
  description?: string;
  createdAt: string;
}

const INDUSTRY_COLORS = [
  { bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/30', hover: 'hover:border-violet-400 dark:hover:border-violet-400/60', text: 'text-violet-600 dark:text-violet-400', glow: '#8b5cf6' },
  { bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/30', hover: 'hover:border-emerald-400 dark:hover:border-emerald-400/60', text: 'text-emerald-600 dark:text-emerald-400', glow: '#10b981' },
  { bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/30', hover: 'hover:border-amber-400 dark:hover:border-amber-400/60', text: 'text-amber-600 dark:text-amber-400', glow: '#f59e0b' },
  { bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/30', hover: 'hover:border-blue-400 dark:hover:border-blue-400/60', text: 'text-blue-600 dark:text-blue-400', glow: '#3b82f6' },
  { bg: 'bg-rose-100/60 dark:bg-rose-500/[0.06]', border: 'border-rose-200 dark:border-rose-500/30', hover: 'hover:border-rose-400 dark:hover:border-rose-400/60', text: 'text-rose-600 dark:text-rose-400', glow: '#f43f5e' },
  { bg: 'bg-indigo-100/60 dark:bg-indigo-500/[0.06]', border: 'border-indigo-200 dark:border-indigo-500/30', hover: 'hover:border-indigo-400 dark:hover:border-indigo-400/60', text: 'text-indigo-600 dark:text-indigo-400', glow: '#6366f1' },
];

const NOTEBOOK_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
];

const APP_CARD_THEME = {
  gradient: 'from-amber-500 to-orange-600',
  bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]',
  border: 'border-amber-200 dark:border-amber-500/20',
  glow: '#f59e0b',
  hoverText: 'group-hover:text-amber-500',
};

const TYPE_STYLES: Record<string, { gradient: string; label: string }> = {
  MODEL: { gradient: 'from-violet-500 to-purple-600', label: 'Model' },
  AGENT: { gradient: 'from-emerald-500 to-teal-600', label: 'Agent' },
  APP: { gradient: 'from-cyan-500 to-sky-600', label: 'App' },
};

export const StudentDashboard = () => {
  const { user: authUser, accessToken } = useAppStore();
  const { data, loading, error } = useDashboard<StudentDashboardData>('student');
  const [fieldStats, setFieldStats] = useState<FieldStat[]>([]);
  const [recentNotebooks, setRecentNotebooks] = useState<NotebookHistoryEntry[]>([]);
  const [trendingApps, setTrendingApps] = useState<TrendingApp[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<{ id: string; feedItem: { title: string; contentType: string; fieldSlug: string }; lastReadAt: string }[]>([]);

  useEffect(() => {
    if (!data?.user?.interests?.length) return;
    const slugs = data.user.interests;
    fetch(`/api/home/field-stats?fields=${slugs.join(',')}`)
      .then(r => r.json())
      .then(res => { if (res.data) setFieldStats(res.data); })
      .catch(() => {});
  }, [data?.user?.interests]);

  useEffect(() => {
    notebookApi.getHistory().then(setRecentNotebooks).catch(() => {});
    fetch('/api/home/trending?timeframe=month&type=APP&limit=6')
      .then(r => r.json())
      .then(res => { if (res.data) setTrendingApps(res.data.slice(0, 6)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/student/history?timeframe=week', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => { if (res.data) setRecentlyViewed(res.data.slice(0, 5)); })
      .catch(() => {});
  }, [accessToken]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error || !data) return null;

  const displayName = authUser?.name || data.user.name;
  const interests = data.user.interests;

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

      {/* Your Industries */}
      {interests.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">
            Your Industries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fieldStats.length > 0
              ? fieldStats.map((field, idx) => {
                  const c = field._count;
                  const palette = INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length];
                  return (
                    <Link key={field.slug} href={`/explore/${field.slug}`}>
                      <div className={`group relative p-7 rounded-2xl border ${palette.border} ${palette.hover} ${palette.bg} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full`}>
                        <div className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-2xl" style={{ background: palette.glow }} />
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl">{field.icon}</span>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white transition-colors">{field.name}</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                              { label: 'Models', count: c.models, color: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/15' },
                              { label: 'Agents', count: c.agents, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15' },
                              { label: 'Apps', count: c.apps, color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/15' },
                            ].map(stat => (
                              <div key={stat.label} className={`text-center p-2 rounded-xl ${stat.color}`}>
                                <div className="text-lg font-extrabold">{stat.count}</div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{stat.label}</div>
                              </div>
            ))}
          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${palette.text} transition-colors`}>
                            Explore {field.name}
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </div>
          </div>
        </div>
                    </Link>
                  );
                })
              : interests.map((slug, idx) => {
                  const palette = INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length];
                  return (
                    <Link key={slug} href={`/explore/${slug}`}>
                      <div className={`group p-7 rounded-2xl border ${palette.border} ${palette.hover} ${palette.bg} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
                        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white capitalize group-hover:text-emerald-500 transition-colors mb-3">{slug}</h3>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${palette.text} transition-colors`}>
                          Explore
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
          </div>
          </div>
                    </Link>
                  );
                })
            }
        </div>
      </section>
      )}

      {/* Trending Apps */}
      {trendingApps.length > 0 && (
      <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">📱</span>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Trending Apps</h2>
            </div>
            <Link href="/trending" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingApps.map((app, idx) => {
              const href = app.tryUrl ? safeExternalUrl(app.tryUrl) : `/explore/${app.fieldSlug}`;
              const isExternal = !!app.tryUrl;
              return (
                <a
                  key={app.id}
                  href={href}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  <div className={`group relative p-5 rounded-2xl border ${APP_CARD_THEME.border} ${APP_CARD_THEME.bg} shadow-sm hover:shadow-lg transition-all duration-300 min-h-[148px] h-full flex flex-col overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: APP_CARD_THEME.glow }} />
                    <div className="relative flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${APP_CARD_THEME.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="text-white text-[10px] font-black">{idx + 1}</span>
                        </div>
                        {isExternal && (
                          <ExternalLink size={13} className="text-gray-400 dark:text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        )}
                      </div>
                      <h3 className={`text-sm font-bold text-gray-900 dark:text-white ${APP_CARD_THEME.hoverText} transition-colors mb-1.5`}>{app.title}</h3>
                      {app.builtBy && (
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">by {app.builtBy}</p>
                      )}
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <span className="text-base">{app.fieldIcon}</span>
                        <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{app.field}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
               </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-indigo-500" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">Recently Viewed</h2>
            </div>
            <Link href="/history" className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="space-y-2">
            {recentlyViewed.map((entry) => {
              const typeKey = entry.feedItem.contentType || 'MODEL';
              const style = TYPE_STYLES[typeKey] || TYPE_STYLES.MODEL;
              return (
                <Link key={entry.id} href={`/explore/${entry.feedItem.fieldSlug}`}>
                  <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-100/50 dark:bg-indigo-500/[0.06] hover:shadow-sm transition-all duration-200">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0`}>
                      <Clock size={12} className="text-white" />
              </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors truncate">{entry.feedItem.title}</h3>
                      <p className="text-[10px] text-gray-400 dark:text-slate-600">{entry.feedItem.fieldSlug} &middot; {style.label}</p>
           </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-600 shrink-0">{new Date(entry.lastReadAt).toLocaleDateString()}</span>
              </div>
                </Link>
              );
            })}
           </div>
        </section>
      )}

      {/* Recent Notebooks */}
      {recentNotebooks.length > 0 && (
      <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">My Notebooks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotebooks.map((entry, idx) => (
              <Link key={entry.id} href="/notebooks"
                className="group p-5 rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-100/50 dark:bg-violet-500/[0.06] shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${NOTEBOOK_COLORS[idx % NOTEBOOK_COLORS.length]} flex items-center justify-center shrink-0 shadow-md`}>
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors truncate">{entry.notebook.title}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-0.5">{entry.notebook.industry?.name} &middot; {entry.notebook.category}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1">Opened {new Date(entry.accessedAt).toLocaleDateString()}</p>
                  </div>
                  <MessageCircle size={13} className="text-gray-400 dark:text-slate-600 group-hover:text-violet-400 shrink-0 mt-1 transition-colors" />
        </div>
              </Link>
              ))}
           </div>
        </section>
      )}

      {/* Learn the Basics */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">Learn the Basics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {interests.length > 0 ? interests.map((slug, idx) => {
            const palette = INDUSTRY_COLORS[(idx + 2) % INDUSTRY_COLORS.length];
            return (
              <Link key={slug} href="/basics">
                <div className={`group p-6 rounded-2xl border ${palette.border} ${palette.hover} ${palette.bg} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
                      <span className="text-white text-lg">📓</span>
         </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize group-hover:text-cyan-500 transition-colors">AI Basics for {slug}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-slate-500">Notebook &middot; Fundamentals</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">Start with the fundamentals of AI in {slug}.</p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors mt-4">
                    Start Learning
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <Link href="/basics">
              <div className="group p-6 rounded-2xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-100/60 dark:bg-cyan-500/[0.06] shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
                    <span className="text-white text-lg">📓</span>
                 </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">AI Basics</h3>
                 </div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Learn the fundamentals of AI</p>
              </div>
            </Link>
          )}
         </div>
      </section>

      {/* Ask AI */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-5">Have Questions?</h2>
        <Link href={interests.length > 0 ? `/explore/${interests[0]}` : '/industries'}>
          <div className="group relative p-7 rounded-2xl border border-violet-200 dark:border-violet-500/30 bg-violet-100/60 dark:bg-violet-500/[0.06] shadow-sm hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-400/60 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-3xl bg-violet-500" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/25">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">Ask AI</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Ask anything about AI in your fields. Get instant answers powered by AI.</p>
              </div>
              <svg className="w-5 h-5 text-violet-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
           </div>
                </div>
        </Link>
      </section>

    </div>
  );
};
