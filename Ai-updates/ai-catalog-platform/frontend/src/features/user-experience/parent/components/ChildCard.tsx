'use client';
import React from 'react';
import Link from 'next/link';

interface ChildStats {
  skillsLearned: number;
  skillsTotal: number;
  careersExplored: number;
  minutesThisWeek: number;
  itemsReadThisWeek: number;
  notebooksThisWeek: number;
}

interface ChildInfo {
  id: string;
  name: string;
  email: string;
  gradeLevel: string | null;
  interests: string[];
  stats: ChildStats;
}

const CARD_COLORS = [
  { bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/20', accent: 'text-blue-700 dark:text-blue-400', statBg: 'bg-blue-200/40 dark:bg-blue-500/10' },
  { bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20', accent: 'text-emerald-700 dark:text-emerald-400', statBg: 'bg-emerald-200/40 dark:bg-emerald-500/10' },
  { bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20', accent: 'text-violet-700 dark:text-violet-400', statBg: 'bg-violet-200/40 dark:bg-violet-500/10' },
  { bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20', accent: 'text-amber-700 dark:text-amber-400', statBg: 'bg-amber-200/40 dark:bg-amber-500/10' },
];

export const ChildCard = ({ child, index }: { child: ChildInfo; index: number }) => {
  const c = CARD_COLORS[index % CARD_COLORS.length];
  const hours = Math.floor(child.stats.minutesThisWeek / 60);
  const mins = child.stats.minutesThisWeek % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <Link href={`/parent/child/${child.id}`}
      className={`block p-6 rounded-2xl border ${c.border} ${c.bg} hover:shadow-md transition-all group`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${c.statBg} ${c.accent}`}>
          {child.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {child.name}
          </h4>
          {child.gradeLevel && (
            <p className="text-[10px] text-slate-500">{child.gradeLevel}</p>
          )}
        </div>
        <span className="text-slate-400 group-hover:translate-x-1 transition-transform">&#8594;</span>
      </div>

      {child.interests.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {child.interests.slice(0, 3).map(interest => (
            <span key={interest} className={`px-2 py-0.5 rounded-full ${c.statBg} ${c.accent} text-[10px] font-bold`}>
              {interest}
            </span>
          ))}
          {child.interests.length > 3 && (
            <span className="text-[10px] text-slate-400">+{child.interests.length - 3}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Notebooks', value: child.stats.notebooksThisWeek, icon: '📓' },
          { label: 'Skills', value: `${child.stats.skillsLearned}/${child.stats.skillsTotal}`, icon: '' },
          { label: 'Careers', value: child.stats.careersExplored, icon: '' },
          { label: 'This Week', value: timeStr, icon: '' },
        ].map(stat => (
          <div key={stat.label} className={`p-2 rounded-lg ${c.statBg} text-center`}>
            <div className={`text-xs font-black ${c.accent}`}>{stat.icon ? `${stat.icon} ` : ''}{stat.value}</div>
            <div className="text-[9px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </Link>
  );
};
