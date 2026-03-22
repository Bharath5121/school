'use client';
import React, { useState } from 'react';
import { useChildData } from '../../hooks/useChildData';

interface SkillItem {
  id: string;
  name: string;
  level: string;
  category: string;
  industry: string;
  status: string;
  updatedAt: string | null;
}

interface SkillsData {
  items: SkillItem[];
  summary: { total: number; learned: number; exploring: number; notStarted: number };
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; text: string; barColor: string }> = {
  LEARNED: { label: 'Learned', bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', barColor: 'bg-emerald-500' },
  EXPLORING: { label: 'Exploring', bg: 'bg-amber-50 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-700 dark:text-amber-400', barColor: 'bg-amber-500' },
  NOT_STARTED: { label: 'Not Started', bg: 'bg-slate-50/50 dark:bg-slate-500/[0.04]', border: 'border-slate-200 dark:border-slate-700/40', text: 'text-slate-400 dark:text-slate-500', barColor: 'bg-slate-300' },
};

type FilterKey = 'ALL' | 'LEARNED' | 'EXPLORING' | 'NOT_STARTED';

export const SkillsProgress = ({ childId }: { childId: string }) => {
  const { data, loading } = useChildData<SkillsData>(childId, 'skills');
  const [filter, setFilter] = useState<FilterKey>('ALL');

  if (loading) return <div className="animate-pulse h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;
  if (!data) return null;

  const { summary, items } = data;
  const progressPct = summary.total > 0 ? Math.round((summary.learned / summary.total) * 100) : 0;

  const filtered = filter === 'ALL' ? items : items.filter(s => s.status === filter);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Skills Being Developed</h3>

      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Overall Progress</span>
          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{progressPct}%</span>
        </div>
        <div className="h-3 bg-emerald-200/60 dark:bg-emerald-900/40 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-emerald-600/60">{summary.learned} learned</span>
          <span className="text-[10px] text-amber-600/60">{summary.exploring} exploring</span>
          <span className="text-[10px] text-slate-400">{summary.notStarted} not started</span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 flex-wrap">
        {([
          { key: 'ALL' as FilterKey, label: 'All', count: summary.total },
          { key: 'LEARNED' as FilterKey, label: 'Learned', count: summary.learned },
          { key: 'EXPLORING' as FilterKey, label: 'Exploring', count: summary.exploring },
          { key: 'NOT_STARTED' as FilterKey, label: 'Not Started', count: summary.notStarted },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              filter === f.key
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
            }`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filtered.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No skills in this category</p>}
        {filtered.map(skill => {
          const config = STATUS_CONFIG[skill.status] || STATUS_CONFIG.NOT_STARTED;
          return (
            <div key={skill.id} className={`p-3 rounded-xl border ${config.border} ${config.bg} flex items-center gap-3`}>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${
                  skill.status === 'NOT_STARTED' ? 'text-slate-400 dark:text-slate-500' : 'text-gray-900 dark:text-white'
                }`}>{skill.name}</p>
                <p className="text-[10px] text-slate-500">{skill.level} &middot; {skill.category} &middot; {skill.industry.replace(/-/g, ' ')}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
