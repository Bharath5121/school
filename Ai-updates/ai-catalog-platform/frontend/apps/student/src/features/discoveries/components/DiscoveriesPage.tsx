'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useDiscoveries } from '../hooks/useDiscoveries';
import { DiscoveryCard } from './DiscoveryCard';

export function DiscoveriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'all';
  const { featured, all, loading, error } = useDiscoveries();

  const setTab = (t: string) => {
    router.push(t === 'all' ? '/discoveries' : `/discoveries?tab=${t}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="h-8 w-40 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-slate-800 rounded mx-auto animate-pulse" />
        </div>
        <div className="flex justify-center gap-3">
          <div className="h-11 w-44 bg-emerald-50 dark:bg-emerald-500/10 rounded-full animate-pulse" />
          <div className="h-11 w-40 bg-emerald-50 dark:bg-emerald-500/10 rounded-full animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-52 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-lg font-semibold text-gray-700 dark:text-white/60 mb-2">Failed to load discoveries</p>
        <p className="text-sm text-gray-500 dark:text-white/40">{error}</p>
      </div>
    );
  }

  const displayItems = tab === 'today' ? featured : all;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">Discoveries</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Explore how AI is changing every industry</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setTab('today')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            tab === 'today'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
          }`}
        >
          ⭐ Today&apos;s Discovery
          {featured.length > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              tab === 'today' ? 'bg-white/25' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}>{featured.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            tab === 'all'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
          }`}
        >
          All Discoveries
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
            tab === 'all' ? 'bg-white/25' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40'
          }`}>{all.length}</span>
        </button>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/10">
          <p className="text-4xl mb-3">🔬</p>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white/60 mb-1">
            {tab === 'today' ? 'No featured discoveries today' : 'No discoveries yet'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-white/40">Check back soon for new AI discoveries!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map(d => (
            <DiscoveryCard key={d.id} discovery={d} variant={d.isFeatured ? 'featured' : 'default'} />
          ))}
        </div>
      )}
    </div>
  );
}
