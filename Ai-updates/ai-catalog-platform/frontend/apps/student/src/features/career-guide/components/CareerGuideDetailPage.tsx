'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Lightbulb, Wrench, ListChecks } from 'lucide-react';
import { useCareerGuideDetail } from '../hooks/useCareerGuide';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

type Tab = 'overview' | 'steps' | 'ask-buddy';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'overview', label: 'Overview', emoji: '📋' },
  { id: 'steps', label: 'Steps', emoji: '🧭' },
  { id: 'ask-buddy', label: 'Ask Buddy', emoji: '🤖' },
];

function normalizeSteps(steps: unknown): string[] {
  if (!steps) return [];
  if (Array.isArray(steps)) return steps.map((s) => (typeof s === 'string' ? s : JSON.stringify(s)));
  if (typeof steps === 'string') return steps.split('\n').map((s) => s.trim()).filter(Boolean);
  return [JSON.stringify(steps)];
}

export function CareerGuideDetailPage({ id }: { id: string }) {
  const { guide, loading } = useCareerGuideDetail(id);
  const [tab, setTab] = useState<Tab>('overview');

  const steps = useMemo(() => normalizeSteps(guide?.steps), [guide?.steps]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-44 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" />)}</div>
        <div className="h-48 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">💡</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guide not found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">This guide may not exist yet.</p>
        <Link href="/career-guide" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
          Back to Guides
        </Link>
      </div>
    );
  }

  return (
    <div>
      <HistoryTracker contentType="career-guide" contentId={id} title={guide.title} />
      <Link href="/career-guide" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Guides
      </Link>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-100/80 dark:border-emerald-500/15 mb-6">
        <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white dark:from-emerald-500/[0.06] dark:via-teal-500/[0.03] dark:to-transparent p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Lightbulb size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{guide.title}</h1>
                <SaveButton contentType="career-guide" contentId={guide.id} title={guide.title} size="md" />
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{guide.industry.icon} {guide.industry.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold">{guide.difficulty}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-white/10">{guide.timeRequired}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 sm:p-8 mb-12 shadow-sm">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{guide.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">What You'll Learn</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{guide.whatYouLearn}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Wrench size={14} /> Tools Needed</h3>
              <div className="flex flex-wrap gap-2">
                {guide.toolsNeeded.length > 0
                  ? guide.toolsNeeded.map((tool, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200/50 dark:border-emerald-500/15">
                      {tool}
                    </span>
                  ))
                  : <p className="text-sm text-gray-400 dark:text-slate-500">No tools listed yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === 'steps' && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><ListChecks size={14} /> Step-by-step</h3>
            {steps.length > 0 ? (
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">{idx + 1}</div>
                    <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8]">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-slate-500">No steps available yet.</p>
            )}
          </div>
        )}

        {tab === 'ask-buddy' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask Buddy</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              AI learning assistant coming soon. Ask questions about this guide and get personalized support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
