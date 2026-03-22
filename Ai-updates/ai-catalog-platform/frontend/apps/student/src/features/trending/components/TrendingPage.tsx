'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { useMyApps } from '../hooks/useTrending';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

function AppIcon({ app }: { app: { logoUrl?: string | null; name: string; icon?: string | null } }) {
  const initials = app.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (app.logoUrl) {
    return (
      <img
        src={app.logoUrl}
        alt={app.name}
        className="w-[60px] h-[60px] rounded-[18px] object-cover shadow-md ring-1 ring-black/[0.04] dark:ring-white/10"
      />
    );
  }
  if (app.icon) {
    return (
      <div className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md ring-1 ring-black/[0.04] dark:ring-white/10">
        <span className="text-2xl">{app.icon}</span>
      </div>
    );
  }
  return (
    <div className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md ring-1 ring-black/[0.04] dark:ring-white/10">
      <span className="text-white text-base font-bold">{initials}</span>
    </div>
  );
}

export function TrendingPage() {
  const { industries, apps, loading } = useMyApps();
  const [activeTab, setActiveTab] = useState<string>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse mx-auto" />
        <div className="flex gap-2 justify-center">
          {[1, 2, 3].map(i => <div key={i} className="h-10 w-28 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />)}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-[60px] h-[60px] rounded-[18px] bg-gray-100 dark:bg-white/5 animate-pulse" />
              <div className="h-3 w-14 bg-gray-100 dark:bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (industries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
          <Rocket size={28} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Apps Yet</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          Apps will appear here based on your selected industries.
        </p>
      </div>
    );
  }

  const filteredApps = activeTab === 'all'
    ? apps
    : apps.filter(a => a.industry?.slug === activeTab);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <Rocket size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">Trending Apps</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Apps curated for your industries</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          All ({apps.length})
        </button>
        {industries.map(ind => {
          const count = apps.filter(a => a.industry?.slug === ind.slug).length;
          return (
            <button
              key={ind.slug}
              onClick={() => setActiveTab(ind.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === ind.slug
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{ind.icon}</span> {ind.name}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === ind.slug ? 'bg-white/25' : 'bg-gray-200 dark:bg-white/10'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-sm text-gray-400 dark:text-slate-500">No apps in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6">
          {filteredApps.map(app => (
            <Link key={app.id} href={`/trending/${app.slug}`} className="group">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 transition-transform duration-200 group-hover:scale-105">
                  <AppIcon app={app} />
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 leading-tight line-clamp-2 max-w-[80px] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {app.name}
                </p>
                {app.provider && (
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate max-w-[80px]">{app.provider}</p>
                )}
                <div className="mt-1">
                  <SaveButton contentType="trending-app" contentId={app.id} title={app.name} metadata={{ slug: app.slug }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
