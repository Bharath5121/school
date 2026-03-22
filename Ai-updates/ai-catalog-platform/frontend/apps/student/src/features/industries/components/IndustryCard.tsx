'use client';

import Link from 'next/link';
import type { Industry } from '../types/industry.types';

const PALETTE = [
  { bg: 'bg-rose-50 dark:bg-rose-500/[0.06]', border: 'border-rose-200 dark:border-rose-500/20', icon: 'bg-rose-100 dark:bg-rose-500/15', hover: 'hover:border-rose-300 dark:hover:border-rose-400/40 hover:shadow-rose-100 dark:hover:shadow-none' },
  { bg: 'bg-amber-50 dark:bg-amber-500/[0.06]', border: 'border-amber-200 dark:border-amber-500/20', icon: 'bg-amber-100 dark:bg-amber-500/15', hover: 'hover:border-amber-300 dark:hover:border-amber-400/40 hover:shadow-amber-100 dark:hover:shadow-none' },
  { bg: 'bg-sky-50 dark:bg-sky-500/[0.06]', border: 'border-sky-200 dark:border-sky-500/20', icon: 'bg-sky-100 dark:bg-sky-500/15', hover: 'hover:border-sky-300 dark:hover:border-sky-400/40 hover:shadow-sky-100 dark:hover:shadow-none' },
  { bg: 'bg-violet-50 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20', icon: 'bg-violet-100 dark:bg-violet-500/15', hover: 'hover:border-violet-300 dark:hover:border-violet-400/40 hover:shadow-violet-100 dark:hover:shadow-none' },
  { bg: 'bg-emerald-50 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20', icon: 'bg-emerald-100 dark:bg-emerald-500/15', hover: 'hover:border-emerald-300 dark:hover:border-emerald-400/40 hover:shadow-emerald-100 dark:hover:shadow-none' },
  { bg: 'bg-orange-50 dark:bg-orange-500/[0.06]', border: 'border-orange-200 dark:border-orange-500/20', icon: 'bg-orange-100 dark:bg-orange-500/15', hover: 'hover:border-orange-300 dark:hover:border-orange-400/40 hover:shadow-orange-100 dark:hover:shadow-none' },
  { bg: 'bg-blue-50 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/20', icon: 'bg-blue-100 dark:bg-blue-500/15', hover: 'hover:border-blue-300 dark:hover:border-blue-400/40 hover:shadow-blue-100 dark:hover:shadow-none' },
  { bg: 'bg-pink-50 dark:bg-pink-500/[0.06]', border: 'border-pink-200 dark:border-pink-500/20', icon: 'bg-pink-100 dark:bg-pink-500/15', hover: 'hover:border-pink-300 dark:hover:border-pink-400/40 hover:shadow-pink-100 dark:hover:shadow-none' },
  { bg: 'bg-teal-50 dark:bg-teal-500/[0.06]', border: 'border-teal-200 dark:border-teal-500/20', icon: 'bg-teal-100 dark:bg-teal-500/15', hover: 'hover:border-teal-300 dark:hover:border-teal-400/40 hover:shadow-teal-100 dark:hover:shadow-none' },
  { bg: 'bg-indigo-50 dark:bg-indigo-500/[0.06]', border: 'border-indigo-200 dark:border-indigo-500/20', icon: 'bg-indigo-100 dark:bg-indigo-500/15', hover: 'hover:border-indigo-300 dark:hover:border-indigo-400/40 hover:shadow-indigo-100 dark:hover:shadow-none' },
  { bg: 'bg-lime-50 dark:bg-lime-500/[0.06]', border: 'border-lime-200 dark:border-lime-500/20', icon: 'bg-lime-100 dark:bg-lime-500/15', hover: 'hover:border-lime-300 dark:hover:border-lime-400/40 hover:shadow-lime-100 dark:hover:shadow-none' },
  { bg: 'bg-cyan-50 dark:bg-cyan-500/[0.06]', border: 'border-cyan-200 dark:border-cyan-500/20', icon: 'bg-cyan-100 dark:bg-cyan-500/15', hover: 'hover:border-cyan-300 dark:hover:border-cyan-400/40 hover:shadow-cyan-100 dark:hover:shadow-none' },
];

interface IndustryCardProps {
  industry: Industry;
  index: number;
}

export function IndustryCard({ industry, index }: IndustryCardProps) {
  const p = PALETTE[index % PALETTE.length];
  const total = industry._count.models + industry._count.agents + industry._count.apps;

  return (
    <Link href={`/industries/${industry.slug}`}>
      <div className={`group relative p-5 rounded-2xl border ${p.border} ${p.bg} ${p.hover} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
        <div className="flex flex-col items-center text-center gap-2.5">
          <div className={`w-11 h-11 rounded-xl ${p.icon} flex items-center justify-center text-2xl`}>
            {industry.icon || '🏭'}
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-snug">
            {industry.name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {industry.description}
          </p>
          {total > 0 && (
            <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              {total} {total === 1 ? 'tool' : 'tools'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
