'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ExternalLink, BookOpen } from 'lucide-react';
import { useSkillDetail } from '../hooks/useSkills';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

type Tab = 'overview' | 'why-it-matters' | 'ask-buddy';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'overview', label: 'Overview', emoji: '📋' },
  { id: 'why-it-matters', label: 'Why It Matters', emoji: '🎯' },
  { id: 'ask-buddy', label: 'Ask Buddy', emoji: '🤖' },
];

const LEVEL_BADGE: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  INTERMEDIATE: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  ADVANCED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
};

export function SkillDetailPage({ id }: { id: string }) {
  const { skill, loading } = useSkillDetail(id);
  const [tab, setTab] = useState<Tab>('overview');

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

  if (!skill) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">⚡</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Skill not found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">This skill may not exist yet.</p>
        <Link href="/skills" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
          Back to Skills
        </Link>
      </div>
    );
  }

  return (
    <div>
      <HistoryTracker contentType="skill" contentId={id} title={skill.name} />
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Skills
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-100/80 dark:border-emerald-500/15 mb-6">
        <div className="bg-gradient-to-br from-emerald-50/80 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <Zap size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{skill.name}</h1>
                <SaveButton contentType="skill" contentId={skill.id} title={skill.name} size="md" />
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{skill.industry.icon} {skill.industry.name}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${LEVEL_BADGE[skill.level] || ''}`}>{skill.level}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-white/10">{skill.timeToLearn}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{skill.category}</span>
              </div>
            </div>
          </div>

          {(skill.learnUrl || skill.notebookLmUrl) && (
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-emerald-200/40 dark:border-emerald-500/10">
              {skill.learnUrl && (
                <a href={skill.learnUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-md">
                  <ExternalLink size={14} /> Learn Resource
                </a>
              )}
              {skill.notebookLmUrl && (
                <a href={skill.notebookLmUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors shadow-md">
                  <BookOpen size={14} /> Notebook LM
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 sm:p-8 mb-12 shadow-sm">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{skill.description}</p>
            </div>
          </div>
        )}

        {tab === 'why-it-matters' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Why This Skill Matters</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{skill.whyItMatters}</p>
            </div>
          </div>
        )}

        {tab === 'ask-buddy' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask Buddy</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              AI learning assistant coming soon. Ask questions about this skill and get personalized guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
