'use client';
import React from 'react';
import { useChildData } from '../../hooks/useChildData';

interface CareerItem {
  id: string;
  title: string;
  pathTitle: string;
  industry: string;
  demand: string;
  explored: boolean;
  exploredAt: string | null;
}

const DEMAND_BADGE: Record<string, string> = {
  GROWING: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  STABLE: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  AT_RISK: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export const CareerInterests = ({ childId }: { childId: string }) => {
  const { data, loading } = useChildData<CareerItem[]>(childId, 'career');

  if (loading) return <div className="animate-pulse h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;
  if (!data) return null;

  const exploredCount = data.filter(c => c.explored).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Career Interests</h3>
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
          {exploredCount} of {data.length} explored
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {data.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No careers in catalog yet</p>}
        {data.map(career => (
          <div key={career.id}
            className={`p-3 rounded-xl border flex items-center gap-3 ${
              career.explored
                ? 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/[0.06]'
                : 'border-slate-200 dark:border-slate-700/40 bg-slate-50/50 dark:bg-slate-800/20'
            }`}>
            <span className="text-lg">{career.explored ? '🗺️' : '🔒'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${
                career.explored ? 'text-gray-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}>{career.title}</p>
              <p className="text-[10px] text-slate-500">{career.pathTitle} &middot; {career.industry.replace(/-/g, ' ')}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {career.explored ? (
                <>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DEMAND_BADGE[career.demand] || DEMAND_BADGE.STABLE}`}>
                    {career.demand}
                  </span>
                  {career.exploredAt && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(career.exploredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700/30 dark:text-slate-500">
                  Not Explored
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
