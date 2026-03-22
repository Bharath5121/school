'use client';
import React from 'react';
import { useChildData } from '../../hooks/useChildData';

interface CompletedData {
  completedReading: { id: string; title: string; type: string; field: string; completedAt: string }[];
  learnedSkills: { id: string; name: string; level: string; category: string; industry: string }[];
}

export const CompletedTopics = ({ childId }: { childId: string }) => {
  const { data, loading } = useChildData<CompletedData>(childId, 'completed');

  if (loading) return <div className="animate-pulse h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;
  if (!data) return null;

  const total = data.completedReading.length + data.learnedSkills.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Completed Topics</h3>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {total} completed
        </span>
      </div>

      {data.learnedSkills.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Mastered Skills</p>
          <div className="space-y-1.5">
            {data.learnedSkills.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
                <span className="text-emerald-500 text-sm">&#10003;</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white flex-1 truncate">{s.name}</span>
                <span className="text-[10px] text-slate-400">{s.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.completedReading.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Completed Reading</p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {data.completedReading.map(r => (
              <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20">
                <span className="text-blue-500 text-sm">&#10003;</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white flex-1 truncate">{r.title}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(r.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && <p className="text-xs text-slate-400 text-center py-6">No completed topics yet</p>}
    </div>
  );
};
