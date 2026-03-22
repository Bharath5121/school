'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Trash2 } from 'lucide-react';
import { myStuffApi, type HistoryItem } from '../services/my-stuff.api';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'discovery', label: 'Discoveries' },
  { key: 'basic', label: 'Basics' },
  { key: 'skill', label: 'Skills' },
  { key: 'career-guide', label: 'Guides' },
  { key: 'career-job', label: 'Careers' },
  { key: 'lab-item', label: 'AI Lab' },
  { key: 'trending-app', label: 'Apps' },
];

const TYPE_META: Record<string, { label: string; emoji: string; color: string; pathFn: (item: HistoryItem) => string }> = {
  discovery:      { label: 'Discovery', emoji: '🔬', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', pathFn: (i) => `/discoveries/${i.slug || i.contentId}` },
  basic:          { label: 'Basics', emoji: '📚', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', pathFn: (i) => `/basics/${i.slug || i.contentId}` },
  skill:          { label: 'Skill', emoji: '⚡', color: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300', pathFn: (i) => `/skills/${i.contentId}` },
  'career-job':   { label: 'Career', emoji: '💼', color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300', pathFn: (i) => `/career-map/${i.contentId}` },
  'career-guide': { label: 'Guide', emoji: '💡', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', pathFn: (i) => `/career-guide/${i.contentId}` },
  'lab-item':     { label: 'Lab', emoji: '🧪', color: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300', pathFn: (i) => `/lab/${i.metadata?.categorySlug || 'item'}/${i.slug || i.contentId}` },
  'trending-app': { label: 'App', emoji: '🚀', color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300', pathFn: (i) => `/trending/${i.slug || i.contentId}` },
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    myStuffApi.getHistory(100)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleClear = async () => {
    if (!confirm('Clear all reading history?')) return;
    await myStuffApi.clearHistory();
    setItems([]);
  };

  const filtered = activeTab === 'all' ? items : items.filter((i) => i.contentType === activeTab);

  return (
    <div className="space-y-5">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-white/90" />
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">Reading History</h1>
              <p className="text-emerald-100 text-[11px] mt-0.5">Everything you&apos;ve explored recently</p>
            </div>
          </div>
          {items.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/15 transition-colors">
              <Trash2 size={12} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {TABS.map((tab) => {
          const count = tab.key === 'all' ? items.length : items.filter((i) => i.contentType === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
              }`}
            >
              {tab.label}{count > 0 && <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-500/5 dark:to-transparent border border-emerald-100/60 dark:border-emerald-500/10 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Clock size={24} className="text-white" />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">No history yet</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
            Start exploring discoveries, skills, guides, and more. Your reading history will appear here.
          </p>
          <Link href="/discoveries" className="inline-flex items-center px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
            Explore Industries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => {
            const meta = TYPE_META[item.contentType] || { label: item.contentType, emoji: '📄', color: 'bg-gray-100 text-gray-600', pathFn: () => '#' };
            return (
              <Link key={item.id} href={meta.pathFn(item)}>
                <div className="group relative rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-4 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200 overflow-hidden h-full">
                  <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-emerald-300/10 dark:bg-emerald-400/5 blur-2xl group-hover:bg-emerald-300/20 transition-all" />
                  <div className="relative space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="ml-auto text-[10px] text-gray-400 dark:text-slate-500">{formatTimeAgo(item.viewedAt)}</span>
                    </div>

                    <h3 className="text-[14px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-gray-400 dark:text-slate-500">
                      Viewed {new Date(item.viewedAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-0.5 group-hover:gap-2 transition-all">
                      Open
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
