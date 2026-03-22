'use client';
import React, { useState } from 'react';
import { useChildData } from '../../hooks/useChildData';

interface NotebookItem {
  id: string;
  title: string;
  category: string;
  industry: string;
  url: string | null;
  description: string | null;
  accessedAt: string;
}

interface NotebookData {
  total: number;
  byCategory: Record<string, number>;
  byDay: Record<string, NotebookItem[]>;
  items: NotebookItem[];
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  MODELS: { bg: 'bg-indigo-50 dark:bg-indigo-500/[0.08]', border: 'border-indigo-200 dark:border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', icon: '🤖', label: 'Models' },
  AGENTS: { bg: 'bg-teal-50 dark:bg-teal-500/[0.08]', border: 'border-teal-200 dark:border-teal-500/20', text: 'text-teal-600 dark:text-teal-400', icon: '🧠', label: 'Agents' },
  APPS: { bg: 'bg-rose-50 dark:bg-rose-500/[0.08]', border: 'border-rose-200 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', icon: '📱', label: 'Apps' },
};
const DEFAULT_CFG = { bg: 'bg-slate-50 dark:bg-slate-500/[0.08]', border: 'border-slate-200 dark:border-slate-500/20', text: 'text-slate-600 dark:text-slate-400', icon: '📓', label: 'Other' };

const TIMEFRAME_LABELS: Record<string, string> = { today: 'Today', week: 'This Week', month: 'This Month' };

type CategoryFilter = 'all' | 'MODELS' | 'AGENTS' | 'APPS';

export const NotebookActivity = ({ childId }: { childId: string }) => {
  const [timeframe, setTimeframe] = useState('week');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const { data, loading } = useChildData<NotebookData>(childId, 'notebooks', { timeframe });

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/50" />)}
        </div>
        <div className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
      </div>
    );
  }

  if (!data) return null;

  const filteredByDay: Record<string, NotebookItem[]> = {};
  for (const [day, items] of Object.entries(data.byDay)) {
    const filtered = categoryFilter === 'all' ? items : items.filter(n => n.category === categoryFilter);
    if (filtered.length > 0) filteredByDay[day] = filtered;
  }
  const sortedDays = Object.keys(filteredByDay).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">NotebookLM Panels Explored</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Track which NotebookLM links your child opened</p>
        </div>
        <div className="flex gap-1">
          {(['today', 'week', 'month'] as const).map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                timeframe === t
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Total Count Banner */}
      <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/[0.08] border border-indigo-200 dark:border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-3xl">
            📓
          </div>
          <div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{data.total}</div>
            <p className="text-xs text-slate-500">
              notebook{data.total !== 1 ? 's' : ''} opened {TIMEFRAME_LABELS[timeframe] || timeframe}
            </p>
          </div>
        </div>
      </div>

      {/* Panels Breakdown by Category */}
      {Object.keys(data.byCategory).length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Panels Opened</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.byCategory).map(([category, count]) => {
              const cfg = CATEGORY_CONFIG[category] || DEFAULT_CFG;
              return (
                <div key={category} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} text-center`}>
                  <div className="text-2xl mb-1">{cfg.icon}</div>
                  <div className={`text-lg font-black ${cfg.text}`}>{count}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{cfg.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      {data.total > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {([
            { id: 'all' as const, label: 'All', icon: '📓' },
            { id: 'MODELS' as const, label: 'Models', icon: '🤖' },
            { id: 'AGENTS' as const, label: 'Agents', icon: '🧠' },
            { id: 'APPS' as const, label: 'Apps', icon: '📱' },
          ]).map(tab => {
            const isActive = categoryFilter === tab.id;
            const count = tab.id === 'all' ? data.total : (data.byCategory[tab.id] || 0);
            return (
              <button key={tab.id} onClick={() => setCategoryFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/15'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                }`}>
                <span>{tab.icon}</span> {tab.label}
                <span className={`ml-0.5 ${isActive ? 'opacity-70' : 'opacity-50'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Notebook List Grouped by Day */}
      {data.total === 0 || sortedDays.length === 0 ? (
        <div className="text-center py-10 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-700/30">
          <div className="text-4xl mb-3">📓</div>
          <p className="text-sm text-slate-500 font-medium">
            {categoryFilter !== 'all'
              ? `No ${(CATEGORY_CONFIG[categoryFilter] || DEFAULT_CFG).label} notebooks opened ${TIMEFRAME_LABELS[timeframe]?.toLowerCase() || timeframe}`
              : `No notebooks opened ${TIMEFRAME_LABELS[timeframe]?.toLowerCase() || timeframe}`}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
            When your child explores NotebookLM resources, each panel they open will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDays.map(day => {
            const dayItems = filteredByDay[day];
            const label = formatDayLabel(day);
            return (
              <div key={day}>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
                  <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-full">
                    {dayItems.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayItems.map((nb, i) => {
                    const cfg = CATEGORY_CONFIG[nb.category] || DEFAULT_CFG;
                    return (
                      <div key={`${nb.id}-${i}`} className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center gap-3`}>
                        <div className={`w-10 h-10 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center text-lg flex-shrink-0`}>
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{nb.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase ${cfg.text}`}>{cfg.label}</span>
                            <span className="text-[10px] text-slate-400">{nb.industry.replace(/-/g, ' ')}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(nb.accessedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          {nb.description && (
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{nb.description}</p>
                          )}
                        </div>
                        {nb.url && (
                          <a href={nb.url} target="_blank" rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-[10px] font-bold hover:bg-indigo-600 transition-all flex-shrink-0 shadow-sm shadow-indigo-500/10">
                            Open in NotebookLM
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (target.getTime() === today.getTime()) return 'Today';
  if (target.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
