'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { ExternalLink, Bookmark, Trash2 } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';

interface ContentBookmark {
  id: string;
  contentType: string;
  contentId: string;
  title: string;
  url: string | null;
  metadata: any;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; gradient: string; border: string; badge: string; tint: string }> = {
  MODEL: { label: 'Model', gradient: 'from-violet-500 to-purple-600', border: 'border-violet-200 dark:border-violet-500/20', badge: 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400', tint: 'bg-violet-100/60 dark:bg-violet-500/[0.06]' },
  AGENT: { label: 'Agent', gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-200 dark:border-emerald-500/20', badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', tint: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]' },
  APP: { label: 'App', gradient: 'from-cyan-500 to-sky-600', border: 'border-cyan-200 dark:border-cyan-500/20', badge: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400', tint: 'bg-cyan-100/60 dark:bg-cyan-500/[0.06]' },
  GUIDE: { label: 'Guide', gradient: 'from-amber-500 to-orange-600', border: 'border-amber-200 dark:border-amber-500/20', badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400', tint: 'bg-amber-100/60 dark:bg-amber-500/[0.06]' },
  PROMPT: { label: 'Prompt', gradient: 'from-rose-500 to-pink-600', border: 'border-rose-200 dark:border-rose-500/20', badge: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400', tint: 'bg-rose-100/60 dark:bg-rose-500/[0.06]' },
  CAREER_JOB: { label: 'Career', gradient: 'from-indigo-500 to-purple-600', border: 'border-indigo-200 dark:border-indigo-500/20', badge: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400', tint: 'bg-indigo-100/60 dark:bg-indigo-500/[0.06]' },
  SKILL: { label: 'Skill', gradient: 'from-teal-500 to-emerald-600', border: 'border-teal-200 dark:border-teal-500/20', badge: 'bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400', tint: 'bg-teal-100/60 dark:bg-teal-500/[0.06]' },
};

const FILTER_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Models', value: 'MODEL' },
  { label: 'Agents', value: 'AGENT' },
  { label: 'Apps', value: 'APP' },
  { label: 'Guides', value: 'GUIDE' },
  { label: 'Prompts', value: 'PROMPT' },
  { label: 'Careers', value: 'CAREER_JOB' },
  { label: 'Skills', value: 'SKILL' },
];

export default function SavedPage() {
  const { accessToken } = useAppStore();
  const [bookmarks, setBookmarks] = useState<ContentBookmark[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    const params = filter ? `?contentType=${filter}` : '';
    fetch(`/api/student/saved-content${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(res => { if (res.data) setBookmarks(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, filter]);

  const removeBookmark = async (contentType: string, contentId: string) => {
    if (!accessToken) return;
    await fetch(`/api/student/saved-content/${contentType}/${contentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setBookmarks(prev => prev.filter(b => !(b.contentType === contentType && b.contentId === contentId)));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-8 shadow-lg shadow-violet-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-3">
          <Bookmark size={24} className="text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Items</h1>
            <p className="text-violet-100 text-sm mt-1">Everything you&apos;ve bookmarked for later</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map(opt => (
          <button key={opt.value || 'all'} onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              filter === opt.value
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm shadow-violet-500/25'
                : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bookmark size={28} className="text-white" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No saved items yet</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Save models, agents, apps, and guides from the explore pages.</p>
          <Link href="/industries" className="inline-block mt-4 px-5 py-2.5 bg-violet-500 hover:bg-violet-400 text-white font-semibold rounded-xl text-sm transition-colors">
            Explore Industries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map(bm => {
            const cfg = TYPE_CONFIG[bm.contentType] || TYPE_CONFIG.MODEL;
            const industrySlug = bm.metadata?.industrySlug;
            return (
              <div key={bm.id} className={`group relative p-5 rounded-2xl border ${cfg.border} ${cfg.tint} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: cfg.gradient.includes('violet') ? '#8b5cf6' : cfg.gradient.includes('emerald') ? '#10b981' : '#06b6d4' }} />
                <div className="relative flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm`}>
                      <Bookmark size={14} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                      <button onClick={() => removeBookmark(bm.contentType, bm.contentId)}
                        className="p-1 rounded-lg text-gray-400 dark:text-slate-600 hover:text-red-500 transition-colors"
                        title="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{bm.title}</h3>
                  {bm.metadata?.builtBy && (
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mb-3">by {bm.metadata.builtBy}</p>
                  )}
                  <div className="flex gap-2 mt-auto">
                    {bm.url && (
                      <a href={safeExternalUrl(bm.url)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                        Visit <ExternalLink size={12} />
                      </a>
                    )}
                    {industrySlug && (
                      <Link href={`/explore/${industrySlug}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                        Explore &rarr;
                      </Link>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-3">Saved {new Date(bm.createdAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
