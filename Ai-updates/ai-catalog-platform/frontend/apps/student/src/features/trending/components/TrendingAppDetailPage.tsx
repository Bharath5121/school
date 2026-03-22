'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Info, Lightbulb, BookOpen } from 'lucide-react';
import { useAppDetail } from '../hooks/useTrending';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

type Tab = 'description' | 'usage' | 'how-it-helps';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'description', label: 'About', emoji: '📋' },
  { id: 'usage', label: 'How to Use', emoji: '📖' },
  { id: 'how-it-helps', label: 'Benefits', emoji: '💡' },
];

export function TrendingAppDetailPage({ slug }: { slug: string }) {
  const { app, loading } = useAppDetail(slug);
  const [tab, setTab] = useState<Tab>('description');

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-44 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2">{[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" />)}</div>
        <div className="h-48 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">📱</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">App not found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">This app may not exist or is not published yet.</p>
        <Link href="/trending" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
          Back to Apps
        </Link>
      </div>
    );
  }

  const logoFallback = app.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const tabContent: Record<Tab, string | null | undefined> = {
    description: app.description,
    usage: app.usage,
    'how-it-helps': app.howItHelps,
  };

  return (
    <div>
      <HistoryTracker contentType="trending-app" contentId={slug} title={app.name} slug={app.slug} />
      {/* Back */}
      <Link href="/trending" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Apps
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-100/80 dark:border-emerald-500/15 mb-6">
        {app.coverImageUrl ? (
          <div className="relative">
            <img src={app.coverImageUrl} alt="" className="w-full h-48 sm:h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-end gap-4">
                {app.logoUrl ? (
                  <img src={app.logoUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-xl ring-2 ring-white/30" />
                ) : app.icon ? (
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl ring-2 ring-white/30">
                    <span className="text-3xl">{app.icon}</span>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl ring-2 ring-white/30">
                    <span className="text-white text-lg font-bold">{logoFallback}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{app.name}</h1>
                  {app.provider && <p className="text-white/70 text-sm mt-0.5">by {app.provider}</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white dark:from-emerald-500/[0.06] dark:via-teal-500/[0.03] dark:to-transparent p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {app.logoUrl ? (
                <img src={app.logoUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-1 ring-black/[0.04] dark:ring-white/10" />
              ) : app.icon ? (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{app.icon}</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">{logoFallback}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{app.name}</h1>
                {app.provider && <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">by {app.provider}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Meta bar */}
        <div className="flex items-center gap-2 flex-wrap px-6 sm:px-8 py-4 bg-white dark:bg-[#111827] border-t border-emerald-100/60 dark:border-emerald-500/10">
          {app.tagline && <p className="text-sm text-gray-600 dark:text-slate-300 flex-1">{app.tagline}</p>}
          <div className="flex items-center gap-2 flex-wrap">
            {app.isFree && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Free</span>
            )}
            {app.isAd && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">Sponsored</span>
            )}
            {app.industry && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-white/10">
                {app.industry.icon} {app.industry.name}
              </span>
            )}
            {app.category && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-white/10">
                {app.category.title}
              </span>
            )}
          </div>
          <SaveButton contentType="trending-app" contentId={app.id} title={app.name} metadata={{ slug: app.slug }} size="md" />
        </div>
      </div>

      {/* Visit App Button */}
      {app.url && (
        <div className="mb-6">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            Visit App <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 sm:p-8 mb-12 shadow-sm">
        {tabContent[tab] ? (
          <div className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">
            {tabContent[tab]}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 dark:text-slate-500 text-sm">
            No content available for this section yet.
          </div>
        )}
      </div>
    </div>
  );
}
