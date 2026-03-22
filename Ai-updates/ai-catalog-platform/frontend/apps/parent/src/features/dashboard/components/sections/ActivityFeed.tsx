'use client';
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useChildData } from '../../hooks/useChildData';

interface ActivityItem {
  type: 'READING' | 'NOTEBOOK' | 'SAVED';
  title: string;
  contentType?: string;
  category?: string;
  field?: string;
  industry?: string;
  url?: string | null;
  timeSpent?: number;
  completed?: boolean;
  date: string;
}

function getActivityLink(item: ActivityItem): string | null {
  if (item.type === 'NOTEBOOK' && item.url) return item.url;
  if (item.type === 'READING' && item.field) return `/explore/${item.field}`;
  if (item.type === 'SAVED' && item.url) return item.url;
  if (item.type === 'SAVED' && item.field) return `/explore/${item.field}`;
  return null;
}

interface ActivityData {
  feed: ActivityItem[];
  counts: { reading: number; notebooks: number; saved: number };
}

const ICON_MAP: Record<string, string> = { READING: '📖', NOTEBOOK: '📓', SAVED: '📌' };
const COLOR_MAP: Record<string, { bg: string; border: string }> = {
  READING: { bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/20' },
  NOTEBOOK: { bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20' },
  SAVED: { bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20' },
};

export const ActivityFeed = ({ childId }: { childId: string }) => {
  const [timeframe, setTimeframe] = useState('week');
  const { data, loading } = useChildData<ActivityData>(childId, 'activity', { timeframe });

  if (loading) return <div className="animate-pulse h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Activity Feed</h3>
        <div className="flex gap-1">
          {['today', 'week', 'month'].map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                timeframe === t
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Read', count: data.counts.reading, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Notebooks', count: data.counts.notebooks, color: 'text-violet-600 dark:text-violet-400' },
          { label: 'Saved', count: data.counts.saved, color: 'text-amber-600 dark:text-amber-400' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30 text-center">
            <div className={`text-lg font-black ${s.color}`}>{s.count}</div>
            <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {data.feed.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">No activity in this period</p>
        )}
        {data.feed.map((item, i) => {
          const c = COLOR_MAP[item.type] || COLOR_MAP.READING;
          const link = getActivityLink(item);
          const isExternal = link?.startsWith('http');
          const Wrapper = link ? 'a' : 'div';
          const linkProps = link ? {
            href: link,
            ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
          } : {};
          return (
            <Wrapper key={i} {...linkProps}
              className={`p-3 rounded-xl border ${c.border} ${c.bg} flex items-start gap-3 ${link ? 'cursor-pointer hover:shadow-sm transition-all group' : ''}`}>
              <span className="text-lg">{ICON_MAP[item.type]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold text-gray-900 dark:text-white truncate ${link ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' : ''}`}>{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{item.type}</span>
                  {item.field && <span className="text-[10px] text-slate-400">{item.field}</span>}
                  {item.timeSpent != null && item.timeSpent > 0 && (
                    <span className="text-[10px] text-slate-400">{Math.round(item.timeSpent / 60)}m</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {link && <ExternalLink size={11} className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
};
