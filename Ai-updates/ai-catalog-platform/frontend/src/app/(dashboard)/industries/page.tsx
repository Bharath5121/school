'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  _count?: { models: number; agents: number; apps: number };
}

const CARD_PALETTES = [
  { border: 'border-violet-200 dark:border-violet-500/20', bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', glow: '#8b5cf6', text: 'text-violet-600 dark:text-violet-400' },
  { border: 'border-emerald-200 dark:border-emerald-500/20', bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', glow: '#10b981', text: 'text-emerald-600 dark:text-emerald-400' },
  { border: 'border-blue-200 dark:border-blue-500/20', bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', glow: '#3b82f6', text: 'text-blue-600 dark:text-blue-400' },
  { border: 'border-amber-200 dark:border-amber-500/20', bg: 'bg-amber-100/60 dark:bg-amber-500/[0.06]', glow: '#f59e0b', text: 'text-amber-600 dark:text-amber-400' },
  { border: 'border-rose-200 dark:border-rose-500/20', bg: 'bg-rose-100/60 dark:bg-rose-500/[0.06]', glow: '#f43f5e', text: 'text-rose-600 dark:text-rose-400' },
  { border: 'border-indigo-200 dark:border-indigo-500/20', bg: 'bg-indigo-100/60 dark:bg-indigo-500/[0.06]', glow: '#6366f1', text: 'text-indigo-600 dark:text-indigo-400' },
];

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home/industries')
      .then(r => r.json())
      .then(res => { if (res.data) setIndustries(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 p-8 shadow-lg shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Industries</h1>
          <p className="text-indigo-100 text-sm mt-1.5">Discover AI tools, models, and career paths across industries</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, idx) => {
            const palette = CARD_PALETTES[idx % CARD_PALETTES.length];
            const c = ind._count || { models: 0, agents: 0, apps: 0 };
            const total = c.models + c.agents + c.apps;
            return (
              <Link key={ind.id} href={`/explore/${ind.slug}`}>
                <div className={`group relative p-6 rounded-2xl border ${palette.border} ${palette.bg} shadow-sm hover:shadow-lg transition-all duration-300 h-full overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: palette.glow }} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{ind.icon}</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{ind.name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{ind.description}</p>
                    {total > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {c.models > 0 && <span className="text-[10px] font-bold bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 px-2.5 py-0.5 rounded-full">{c.models} Models</span>}
                        {c.agents > 0 && <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">{c.agents} Agents</span>}
                        {c.apps > 0 && <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full">{c.apps} Apps</span>}
                      </div>
                    )}
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${palette.text}`}>
                      Explore
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
