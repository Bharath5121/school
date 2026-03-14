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
  _count: { models: number; agents: number; apps: number };
}

export default function CatalogPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const industriesRes = await fetch('/api/home/industries');
        const industriesJson = await industriesRes.json();
        const slugs: string[] = (industriesJson.data || []).map((i: { slug: string }) => i.slug);

        if (slugs.length === 0) {
          setLoading(false);
          return;
        }

        const statsRes = await fetch(`/api/home/field-stats?fields=${slugs.join(',')}`);
        const statsJson = await statsRes.json();
        if (statsJson.data) setIndustries(statsJson.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const filtered = industries.filter(i => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter) {
      const c = i._count;
      if (filter === 'models' && c.models === 0) return false;
      if (filter === 'agents' && c.agents === 0) return false;
      if (filter === 'apps' && c.apps === 0) return false;
    }
    return true;
  });

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-slate-600 dark:text-slate-500 animate-pulse">Loading catalog...</p></div>;

  if (error) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
        <p className="text-red-400 text-lg font-medium">Something went wrong</p>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-900 dark:text-white transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Catalog Directory</h1>
        <p className="text-slate-600 dark:text-slate-500 text-sm mt-1">Explore AI across every industry</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search industries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 text-gray-900 dark:text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40"
        />
        <div className="flex gap-2">
          {['models', 'agents', 'apps'].map(f => (
            <button key={f} onClick={() => setFilter(filter === f ? null : f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:text-gray-900 dark:hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(ind => {
          const c = ind._count;
          const total = c.models + c.agents + c.apps;
          return (
            <Link key={ind.slug} href={`/explore/${ind.slug}`}>
              <div className="group p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" style={{ background: ind.color, filter: 'blur(30px)' }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{ind.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-400 transition-colors">{ind.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <span className="text-xs text-slate-600 dark:text-slate-500">{c.models} Models</span>
                    <span className="text-xs text-slate-600 dark:text-slate-500">{c.agents} Agents</span>
                    <span className="text-xs text-slate-600 dark:text-slate-500">{c.apps} Apps</span>
                  </div>
                  {total > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{total} items</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
