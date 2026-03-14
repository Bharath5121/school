'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WhatsNewPage() {
  const [data, setData] = useState<any>(null);
  const [showAll, setShowAll] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (showAll) params.set('showAll', 'true');
    if (typeFilter) params.set('type', typeFilter);
    fetch(`/api/home/whats-new?${params}`)
      .then(r => r.json())
      .then(res => { if (res.data) setData(res.data); })
      .catch((err: any) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [showAll, typeFilter]);

  const Section = ({ title, items, type }: { title: string; items: any[]; type: string }) => {
    if (!items?.length) return null;
    return (
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map((item: any) => (
            <Link key={item.id} href={`/explore/${item.industrySlug || item.industry?.slug}`}>
              <div className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-emerald-500/20 transition-all cursor-pointer">
                <span className="text-sm">{item.industry?.icon || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white group-hover:text-emerald-400 truncate">{item.name || item.title}</p>
                  <p className="text-xs text-slate-600">{item.industry?.name} &middot; {type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (error) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
        <p className="text-red-400 text-lg font-medium">Something went wrong</p>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-900 dark:text-white transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">What&apos;s New</h1>
          <p className="text-slate-600 dark:text-slate-500 text-sm mt-1">Added in the last 7 days{data?.lastUpdated && ` &middot; Updated ${new Date(data.lastUpdated).toLocaleTimeString()}`}</p>
        </div>
        <button onClick={() => setShowAll(!showAll)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showAll ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}>
          {showAll ? 'Show My Fields' : 'Show All Fields'}
        </button>
      </div>

      <div className="flex gap-2">
        {[null, 'models', 'agents', 'apps', 'guides'].map(t => (
          <button key={t || 'all'} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${typeFilter === t ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white'}`}>
            {t || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20"><p className="text-slate-600 dark:text-slate-500 animate-pulse">Loading...</p></div>
      ) : !data ? (
        <div className="text-center py-20 text-slate-600">Nothing new this week.</div>
      ) : (
        <div className="space-y-8">
          <Section title="New Models" items={data.models} type="Model" />
          <Section title="New Agents" items={data.agents} type="Agent" />
          <Section title="New Apps" items={data.apps} type="App" />
          <Section title="New Guides" items={data.guides} type="Guide" />
        </div>
      )}
    </div>
  );
}
