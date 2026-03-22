'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, AppWindow } from 'lucide-react';
import { useLabCategory } from '../hooks/useLab';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

export function LabCategoryPage({ slug }: { slug: string }) {
  const { category, loading } = useLabCategory(slug);
  const [tab, setTab] = useState<'MODEL' | 'APP'>('MODEL');

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-28 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2"><div className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" /><div className="h-10 w-24 bg-gray-100 dark:bg-white/5 rounded-xl" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{[1,2,3].map(i => <div key={i} className="h-36 rounded-xl bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/50 dark:border-emerald-500/10 animate-pulse" />)}</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔬</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Category Not Found</h2>
        <Link href="/lab" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
          Back to Lab
        </Link>
      </div>
    );
  }

  const models = category.items.filter(i => i.type === 'MODEL');
  const apps = category.items.filter(i => i.type === 'APP');
  const displayItems = tab === 'MODEL' ? models : apps;

  return (
    <div className="space-y-3">
      <Link href="/lab" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
        <ArrowLeft size={16} /> Back to Lab
      </Link>

      <div className="rounded-xl bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white dark:from-emerald-500/[0.05] dark:via-green-500/[0.03] dark:to-transparent border border-emerald-100/80 dark:border-emerald-500/15 px-5 py-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{category.icon}</span>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h1>
        </div>
        {category.description && (
          <p className="text-xs text-gray-600 dark:text-white/50 leading-relaxed">{category.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('MODEL')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === 'MODEL'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
          }`}
        >
          <Cpu size={14} /> Models
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'MODEL' ? 'bg-white/25' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>{models.length}</span>
        </button>
        <button
          onClick={() => setTab('APP')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === 'APP'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
          }`}
        >
          <AppWindow size={14} /> Apps
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === 'APP' ? 'bg-white/25' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40'}`}>{apps.length}</span>
        </button>
      </div>

      {displayItems.length === 0 ? (
        <div className="text-center py-10 bg-emerald-50/30 dark:bg-emerald-500/[0.03] rounded-xl border border-emerald-100/50 dark:border-emerald-500/10">
          <p className="text-sm text-slate-400">No {tab === 'MODEL' ? 'models' : 'apps'} in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayItems.map(item => (
            <Link key={item.id} href={`/lab/${slug}/${item.slug}`}>
              <div className="group relative rounded-xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white dark:from-emerald-500/[0.05] dark:via-green-500/[0.03] dark:to-transparent px-4 py-3.5 hover:shadow-md hover:shadow-emerald-500/8 hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200 overflow-hidden h-full">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-emerald-300/10 dark:bg-emerald-400/5 blur-2xl group-hover:bg-emerald-300/15 transition-all" />
                <div className="relative space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.type === 'MODEL' ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300' : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'}`}>
                      {item.type}
                    </span>
                    <div className="ml-auto">
                      <SaveButton contentType="lab-item" contentId={item.id} title={item.title} metadata={{ slug: item.slug, categorySlug: slug }} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.provider && (
                    <p className="text-[10px] text-slate-500">by {item.provider}</p>
                  )}
                  {item.tagline && (
                    <p className="text-[11px] text-gray-600 dark:text-white/50 leading-relaxed line-clamp-2">{item.tagline}</p>
                  )}
                  {item.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                          {f}
                        </span>
                      ))}
                      {item.features.length > 3 && (
                        <span className="text-[9px] text-slate-400">+{item.features.length - 3}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-1.5 transition-all">
                    Open
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
