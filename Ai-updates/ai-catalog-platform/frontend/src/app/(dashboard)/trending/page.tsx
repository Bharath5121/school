'use client';

import { useEffect, useState, useCallback } from 'react';
import { ExternalLink, Bookmark } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';
import { useAppStore } from '@/store/app.store';

interface TrendingItem {
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

const CARD_PALETTES = [
  { border: 'border-violet-200 dark:border-violet-500/20', bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', glow: '#8b5cf6', hover: 'group-hover:text-violet-500 dark:group-hover:text-violet-400', save: 'text-violet-500' },
  { border: 'border-emerald-200 dark:border-emerald-500/20', bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', glow: '#10b981', hover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400', save: 'text-emerald-500' },
  { border: 'border-blue-200 dark:border-blue-500/20', bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', glow: '#3b82f6', hover: 'group-hover:text-blue-500 dark:group-hover:text-blue-400', save: 'text-blue-500' },
  { border: 'border-amber-200 dark:border-amber-500/20', bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', glow: '#f59e0b', hover: 'group-hover:text-amber-500 dark:group-hover:text-amber-400', save: 'text-amber-500' },
  { border: 'border-rose-200 dark:border-rose-500/20', bg: 'bg-rose-100/60 dark:bg-rose-500/[0.06]', glow: '#f43f5e', hover: 'group-hover:text-rose-500 dark:group-hover:text-rose-400', save: 'text-rose-500' },
  { border: 'border-indigo-200 dark:border-indigo-500/20', bg: 'bg-indigo-100/60 dark:bg-indigo-500/[0.06]', glow: '#6366f1', hover: 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400', save: 'text-indigo-500' },
];

export default function TrendingPage() {
  const { accessToken } = useAppStore();
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/home/trending?timeframe=${timeframe}&type=APP&limit=100`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(res => {
        if (res.data && Array.isArray(res.data)) setItems(res.data);
        else setItems([]);
      })
      .catch((err: any) => {
        console.error('Trending fetch failed:', err);
        setError(err.message || 'Failed to load data');
      })
      .finally(() => setLoading(false));
  }, [timeframe]);

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/student/saved-content?contentType=APP', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          const all = new Set<string>();
          res.data.forEach((b: any) => all.add(`APP:${b.contentId}`));
          setSavedIds(all);
        }
      }).catch(() => {});
  }, [accessToken]);

  const toggleSave = useCallback(async (id: string, title: string, tryUrl?: string) => {
    if (!accessToken) return;
    const key = `APP:${id}`;
    if (savedIds.has(key)) {
      await fetch(`/api/student/saved-content/APP/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      setSavedIds(prev => { const n = new Set(Array.from(prev)); n.delete(key); return n; });
    } else {
      await fetch('/api/student/saved-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'APP', contentId: id, title, url: tryUrl }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), key]));
    }
  }, [accessToken, savedIds]);

  if (error) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8">
        <p className="text-red-600 dark:text-red-400 text-lg font-bold">Something went wrong</p>
        <p className="text-gray-500 dark:text-slate-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2.5 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-xl text-red-700 dark:text-red-400 font-semibold transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 p-8 shadow-lg shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Trending Apps</h1>
            <p className="text-indigo-100 text-sm mt-0.5">Top AI apps and tools across all industries</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['today', 'week', 'month'].map(t => (
          <button key={t} onClick={() => setTimeframe(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 ${
              timeframe === t
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
            }`}>
            {t === 'today' ? 'Today' : t === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No trending apps</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Check back later for trending apps.</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Apps & Tools</h2>
              <p className="text-xs text-gray-500 dark:text-slate-500">{items.length} trending this {timeframe === 'today' ? 'day' : timeframe}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => {
              const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
              const href = item.tryUrl ? safeExternalUrl(item.tryUrl) : `/explore/${item.fieldSlug}`;
              const isExternal = !!item.tryUrl;
              const saveKey = `APP:${item.id}`;
              const isSaved = savedIds.has(saveKey);
              return (
                <div key={item.id} className={`group relative p-5 rounded-2xl border ${palette.border} ${palette.bg} shadow-sm hover:shadow-lg transition-all duration-300 min-h-[148px] h-full flex flex-col overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: palette.glow }} />
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0" style={{ background: `linear-gradient(135deg, ${palette.glow}, ${palette.glow}dd)` }}>
                        <span className="text-white text-[10px] font-black">{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(item.id, item.title, item.tryUrl); }}
                          className={`p-1 rounded-lg transition-all z-10 ${isSaved ? palette.save : 'text-gray-400 dark:text-slate-600 hover:text-indigo-500'}`}
                          title={isSaved ? 'Unsave' : 'Save'}>
                          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                        {isExternal && (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="p-1">
                            <ExternalLink size={13} className="text-gray-400 dark:text-slate-600 group-hover:text-indigo-400 transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>
                    <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined} className="flex-1 flex flex-col">
                      <h3 className={`text-sm font-bold text-gray-900 dark:text-white ${palette.hover} transition-colors mb-1.5 line-clamp-2`}>
                        {item.title}
                      </h3>
                      {item.builtBy && (
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-2">by {item.builtBy}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.fieldIcon}</span>
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{item.field}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
