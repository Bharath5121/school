'use client';
import React, { useState } from 'react';
import { useChildData } from '../../hooks/useChildData';

interface TimeData {
  daily: { date: string; minutes: number }[];
  totalMinutes: number;
}

export const TimeSpentChart = ({ childId }: { childId: string }) => {
  const [timeframe, setTimeframe] = useState('week');
  const { data, loading } = useChildData<TimeData>(childId, 'time-spent', { timeframe });

  if (loading) return <div className="animate-pulse h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;
  if (!data) return null;

  const maxMin = Math.max(...data.daily.map(d => d.minutes), 1);
  const hours = Math.floor(data.totalMinutes / 60);
  const mins = data.totalMinutes % 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Time Spent Learning</h3>
        <div className="flex gap-1">
          {['week', 'month'].map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                timeframe === t
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-cyan-100/60 dark:bg-cyan-500/[0.06] border border-cyan-200 dark:border-cyan-500/20 text-center">
        <div className="text-2xl font-black text-cyan-700 dark:text-cyan-400">
          {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Total this {timeframe}</p>
      </div>

      {data.daily.length > 0 && (
        <div className="flex items-end gap-1 h-28 px-1">
          {data.daily.map((d, i) => {
            const pct = Math.max((d.minutes / maxMin) * 100, 4);
            const dayLabel = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '80px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-lg bg-cyan-400 dark:bg-cyan-500/60 transition-all duration-500"
                    style={{ height: `${pct}%` }}
                    title={`${d.minutes}m`}
                  />
                </div>
                <span className="text-[9px] text-slate-400 font-medium">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      )}

      {data.daily.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">No time tracked in this period</p>
      )}
    </div>
  );
};
