'use client';

import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';
import { useTrendingCategories } from '../hooks/useTrending';

export function TrendingPreview() {
  const { categories, loading } = useTrendingCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) return null;

  const totalApps = categories.reduce((sum, c) => sum + c._count.apps, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket size={18} className="text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Trending Apps</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            {totalApps} AI apps across {categories.length} categories &mdash; sign in to see apps for your industries
          </p>
        </div>
        <Link href="/register" className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 hover:gap-2 transition-all">
          Sign Up <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.slice(0, 8).map(cat => (
          <Link key={cat.id} href="/register">
            <div className="group rounded-xl border border-orange-100/80 dark:border-orange-500/15 bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white dark:from-orange-500/[0.05] dark:via-amber-500/[0.02] dark:to-transparent p-4 hover:shadow-md hover:shadow-orange-100/40 dark:hover:shadow-none hover:border-orange-200 dark:hover:border-orange-500/25 transition-all duration-200 h-full">
              <span className="text-xl mb-2 block">{cat.icon || '🚀'}</span>
              <h3 className="text-[13px] font-bold text-gray-800 dark:text-white leading-snug mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                {cat.title}
              </h3>
              <span className="text-[10px] font-semibold text-orange-600/80 dark:text-orange-400/70">
                {cat._count.apps} apps
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
