'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { useJobDetail } from '../hooks/useCareer';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

type Tab = 'description' | 'skills' | 'ask-buddy';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'description', label: 'Description', emoji: '📋' },
  { id: 'skills', label: 'Skills Needed', emoji: '🎯' },
  { id: 'ask-buddy', label: 'Ask Buddy', emoji: '🤖' },
];

const DEMAND_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  GROWING: { label: 'Growing', bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-300' },
  STABLE: { label: 'Stable', bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
  AT_RISK: { label: 'At Risk', bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-300' },
};

const TIMELINE_LABELS: Record<string, string> = { NOW: 'Available Now', YEAR_2030: 'By 2030', FUTURE: '2035+' };

function formatSalary(min: number, max: number, currency: string) {
  const fmt = (n: number) => `${currency === 'USD' ? '$' : currency}${(n / 1000).toFixed(0)}k`;
  return `${fmt(min)} – ${fmt(max)}`;
}

export function CareerJobDetailPage({ id }: { id: string }) {
  const { job, loading } = useJobDetail(id);
  const [tab, setTab] = useState<Tab>('description');

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 bg-green-100 dark:bg-green-500/10 rounded" />
        <div className="h-44 bg-green-50 dark:bg-green-500/5 rounded-2xl border border-green-100 dark:border-green-500/10" />
        <div className="flex gap-2">{[1, 2, 3].map(i => <div key={i} className="h-10 w-24 bg-green-50 dark:bg-green-500/5 rounded-xl" />)}</div>
        <div className="h-48 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">💼</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Job not found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">This job may not exist yet.</p>
        <Link href="/career-map" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const demand = DEMAND_CONFIG[job.demand] || DEMAND_CONFIG.GROWING;

  return (
    <div>
      <HistoryTracker contentType="career-job" contentId={id} title={job.title} />
      <Link href="/career-map" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Jobs
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-green-100/80 dark:border-green-500/15 mb-6">
        <div className="bg-gradient-to-br from-green-50/80 via-emerald-50/40 to-white dark:from-green-500/[0.06] dark:via-emerald-500/[0.03] dark:to-transparent p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Briefcase size={28} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{job.title}</h1>
                <SaveButton contentType="career-job" contentId={job.id} title={job.title} size="md" />
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{job.careerPath.title}</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                {formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Meta bar */}
        <div className="flex items-center gap-2 flex-wrap px-6 sm:px-8 py-4 bg-white dark:bg-[#111827] border-t border-green-100/60 dark:border-green-500/10">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${demand.bg} ${demand.text}`}>
            {demand.label}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
            {TIMELINE_LABELS[job.timeline]}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-white/10">
            {job.careerPath.industry.icon} {job.careerPath.industry.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400 ml-auto">
            {job.requiredDegree}
          </span>
        </div>
      </div>

      {/* External links */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {job.googleUrl && (
          <a href={job.googleUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
            Search on Google <ExternalLink size={14} />
          </a>
        )}
        {job.notebookLmUrl && (
          <a href={job.notebookLmUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
            Notebook LM <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400'
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 sm:p-8 mb-12 shadow-sm">
        {tab === 'description' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">How AI Changes This Role</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{job.howAiChanges}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Career Path Overview</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{job.careerPath.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">AI Impact Summary</h3>
              <p className="text-[15px] text-gray-600 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{job.careerPath.aiImpactSummary}</p>
            </div>
          </div>
        )}

        {tab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.length > 0 ? (
                  job.requiredSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 text-sm font-medium border border-green-200/50 dark:border-green-500/15">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-slate-500">No required skills listed yet.</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Future Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.futureSkills.length > 0 ? (
                  job.futureSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200/50 dark:border-emerald-500/15">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-slate-500">No future skills listed yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'ask-buddy' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask Buddy</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
              AI career assistant coming soon. Ask questions about {job.title} and get personalized guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
