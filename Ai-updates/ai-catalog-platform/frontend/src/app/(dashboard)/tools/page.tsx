'use client';

import { useEffect, useState } from 'react';
import { safeExternalUrl } from '@/lib/url';

interface App {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  whoUsesIt: string;
  tryUrl: string | null;
  isFree: boolean;
  builtByRole: string;
  careerImpact: string;
  industry: { name: string; slug: string; icon: string; color: string };
}

export default function ToolsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [freeFilter, setFreeFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (freeFilter) params.set('isFree', freeFilter);
    params.set('limit', '50');

    fetch(`/api/home/apps?${params}`)
      .then(r => r.json())
      .then(res => { if (res.data) setApps(res.data); })
      .catch((err: any) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [search, freeFilter]);

  const freeApps = apps.filter(a => a.isFree);

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
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tools & Apps</h1>
        <p className="text-slate-600 dark:text-slate-500 text-sm mt-1">AI apps and products you can use right now</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 text-gray-900 dark:text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40" />
        <select value={freeFilter} onChange={e => setFreeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 text-sm text-slate-500 dark:text-slate-400 focus:outline-none">
          <option value="">All</option>
          <option value="true">Free</option>
          <option value="false">Paid</option>
        </select>
      </div>

      {freeApps.length > 0 && !freeFilter && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 mb-4">Free Tools You Can Use Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {freeApps.slice(0, 4).map(app => (
              <div key={app.id} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50 dark:bg-[#0f1f1a]">
                <div className="flex items-center gap-2 mb-2">
                  <span>{app.industry.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{app.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Free</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-1">{app.description}</p>
                <p className="text-[10px] text-slate-400 mb-2">by {app.builtBy} &middot; {app.builtByRole}</p>
                {app.tryUrl && (
                  <a href={safeExternalUrl(app.tryUrl)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold transition-colors">
                    Try It &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20"><p className="text-slate-600 dark:text-slate-500 animate-pulse">Loading...</p></div>
      ) : apps.length === 0 ? (
        <div className="text-center py-20 text-slate-600">No tools found.</div>
      ) : (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500 mb-4">All Tools</h2>
          <div className="space-y-3">
            {apps.map(app => (
              <div key={app.id} className="p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{app.industry.icon}</span>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{app.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.isFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        {app.isFree ? 'Free' : 'Paid'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">By {app.builtBy} &middot; {app.builtByRole}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{app.description}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{app.careerImpact}</p>
                    <p className="text-[10px] text-slate-600 mt-1">Used by: {app.whoUsesIt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {app.tryUrl && (
                      <a href={safeExternalUrl(app.tryUrl)} target="_blank" rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-semibold">
                        Try It &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
