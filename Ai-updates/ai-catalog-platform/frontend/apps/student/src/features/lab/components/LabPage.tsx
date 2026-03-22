'use client';

import Link from 'next/link';
import { FlaskConical } from 'lucide-react';
import { useLabCategories } from '../hooks/useLab';

export function LabPage() {
  const { categories, loading } = useLabCategories();

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="h-8 w-32 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-slate-800 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <FlaskConical size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">AI Lab</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Explore AI models and apps organized by what they do.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Link key={cat.id} href={`/lab/${cat.slug}`}>
            <div className="group relative rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-5 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200 overflow-hidden h-full">
              <div className="relative space-y-3">
                <span className="text-2xl">{cat.icon}</span>

                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {cat.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20">
                    {cat._count.items} tools
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                    Explore
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/10">
          <p className="text-4xl mb-3">🧪</p>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white/60 mb-1">No lab categories yet</h3>
          <p className="text-sm text-gray-500 dark:text-white/40">Check back soon for new tools to explore!</p>
        </div>
      )}
    </div>
  );
}
