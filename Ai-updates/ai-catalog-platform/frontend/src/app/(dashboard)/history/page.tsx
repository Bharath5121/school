'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';

interface HistoryEntry {
  id: string;
  feedItemId: string;
  timeSpentSeconds: number;
  lastReadAt: string;
  feedItem: { id: string; title: string; contentType: string; fieldSlug: string; };
}

interface Stats {
  itemsThisWeek: number;
  totalTimeSeconds: number;
  mostExplored: { field: string; count: number }[];
}

const CONTENT_STYLES: Record<string, { badge: string; gradient: string }> = {
  MODEL: { badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20', gradient: 'from-violet-500 to-purple-600' },
  AGENT: { badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', gradient: 'from-emerald-500 to-teal-600' },
  APP: { badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20', gradient: 'from-amber-500 to-orange-600' },
  GUIDE: { badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20', gradient: 'from-cyan-500 to-sky-600' },
  LEARNING: { badge: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20', gradient: 'from-rose-500 to-pink-600' },
};

export default function HistoryPage() {
  const { accessToken } = useAppStore();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeframe, setTimeframe] = useState<string>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/student/history?timeframe=${timeframe}`, { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
      fetch('/api/student/history/stats', { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
    ]).then(([histRes, statsRes]) => {
      if (histRes.data) setHistory(histRes.data);
      if (statsRes.data) setStats(statsRes.data);
    }).catch((err: any) => setError(err.message || 'Failed to load data')).finally(() => setLoading(false));
  }, [accessToken, timeframe]);

  const clearHistory = async () => {
    if (!accessToken) return;
    await fetch('/api/student/history', { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
    setHistory([]);
    setStats({ itemsThisWeek: 0, totalTimeSeconds: 0, mostExplored: [] });
  };

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    return m < 60 ? `~${m} min` : `~${Math.floor(m / 60)}h ${m % 60}m`;
  };

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
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 p-8 shadow-lg shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Reading History</h1>
            <p className="text-indigo-100 text-sm mt-1.5">Everything you&apos;ve explored</p>
          </div>
          <button onClick={clearHistory} className="text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
            Clear History
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden p-5 rounded-2xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-blue-500" />
            <div className="relative">
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.itemsThisWeek}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Items this week</p>
            </div>
          </div>
          <div className="relative overflow-hidden p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-emerald-500" />
            <div className="relative">
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatTime(stats.totalTimeSeconds)}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Total time</p>
            </div>
          </div>
          <div className="relative overflow-hidden p-5 rounded-2xl bg-violet-100/60 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20 shadow-sm">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-violet-500" />
            <div className="relative">
              <p className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{stats.mostExplored?.[0]?.field || 'N/A'}</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Most explored</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeframe Filters */}
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">📖</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No reading history yet</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Items you explore will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(h => {
            const style = CONTENT_STYLES[h.feedItem.contentType] || CONTENT_STYLES.MODEL;
            return (
              <Link key={h.id} href={`/explore/${h.feedItem.fieldSlug}`}>
                <div className="group flex items-center gap-4 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-100/50 dark:bg-indigo-500/[0.06] shadow-sm hover:shadow-md transition-all duration-200">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white text-xs font-bold">{h.feedItem.contentType.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors truncate">{h.feedItem.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>{h.feedItem.contentType}</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-600">{h.feedItem.fieldSlug}</span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-600">&middot; {formatTime(h.timeSpentSeconds)}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-slate-600 shrink-0">{new Date(h.lastReadAt).toLocaleDateString()}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
