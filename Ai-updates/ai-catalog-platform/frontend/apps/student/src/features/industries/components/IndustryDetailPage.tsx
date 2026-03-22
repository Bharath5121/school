'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Compass, Box, Bot, AppWindow, Rocket } from 'lucide-react';
import { useIndustryDetail } from '../hooks/useIndustryDetail';
import { useTrendingByIndustry } from '@/features/trending/hooks/useTrending';

type TabId = 'discoveries' | 'models' | 'agents' | 'apps' | 'trending';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'discoveries', label: 'Discoveries', icon: Compass },
  { id: 'models', label: 'Models', icon: Box },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'apps', label: 'Apps', icon: AppWindow },
  { id: 'trending', label: 'Trending', icon: Rocket },
];

export function IndustryDetailPage({ slug }: { slug: string }) {
  const { industry, loading, error } = useIndustryDetail(slug);
  const { apps: trendingApps, loading: trendingLoading } = useTrendingByIndustry(slug);
  const [tab, setTab] = useState<TabId>('discoveries');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !industry) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Industry not found</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">{error || 'This industry does not exist.'}</p>
        <Link href="/" className="text-emerald-500 hover:text-emerald-400 text-sm font-semibold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-8 mb-8" style={{ background: industry.gradient || `linear-gradient(135deg, ${industry.color || '#10b981'}, ${industry.color || '#10b981'}88)` }}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
            {industry.icon || '🏭'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{industry.name}</h1>
            <p className="text-white/80 text-sm mt-1 max-w-xl">{industry.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xs font-semibold text-white/60">{industry._count.discoveries} Discoveries</span>
              <span className="text-xs font-semibold text-white/60">{industry._count.models} Models</span>
              <span className="text-xs font-semibold text-white/60">{industry._count.agents} Agents</span>
              <span className="text-xs font-semibold text-white/60">{industry._count.apps} Apps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-white/10 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                active
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'discoveries' && (
        <div>
          {industry.discoveries.length === 0 ? (
            <div className="text-center py-12">
              <Compass size={32} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">No discoveries published yet for {industry.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industry.discoveries.map((d) => (
                <Link key={d.id} href={`/discoveries/${d.slug}`}>
                  <div className="group p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-3">
                      {d.coverImageUrl && (
                        <img src={d.coverImageUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {d.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">{d.summary}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
                            {d.difficulty}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500">{d.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'models' && (
        <ComingSoon title="AI Models" description={`AI models relevant to ${industry.name} will be available here soon.`} />
      )}

      {tab === 'agents' && (
        <ComingSoon title="AI Agents" description={`AI agents built for ${industry.name} will be listed here soon.`} />
      )}

      {tab === 'apps' && (
        <ComingSoon title="AI Apps" description={`AI-powered applications in ${industry.name} will appear here soon.`} />
      )}

      {tab === 'trending' && (
        <div>
          {trendingLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : trendingApps.length === 0 ? (
            <div className="text-center py-12">
              <Rocket size={32} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">No trending apps linked to {industry.name} yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingApps.map((app) => (
                <Link key={app.id} href={`/trending/${app.slug}`}>
                  <div className="group relative bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-5 hover:shadow-xl hover:shadow-gray-900/[0.04] dark:hover:shadow-none hover:border-gray-300 dark:hover:border-white/10 transition-all duration-200 h-full">
                    <div className="flex items-start gap-3.5">
                      {app.icon ? (
                        <span className="text-2xl w-11 h-11 flex items-center justify-center">{app.icon}</span>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{app.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{app.name}</h3>
                        {app.provider && <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">by {app.provider}</p>}
                      </div>
                    </div>
                    {app.tagline && <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-relaxed mt-3 line-clamp-2">{app.tagline}</p>}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                      {app.isFree && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Free</span>}
                      {app.category && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400">{app.category.title}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">{description}</p>
      <span className="inline-block mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 rounded-full">
        Coming Soon
      </span>
    </div>
  );
}
