'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { useMyCareerPaths } from '../hooks/useCareer';
import type { CareerJobCard } from '../types/career.types';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

const DEMAND_CONFIG: Record<string, { label: string; icon: typeof TrendingUp; bg: string; text: string }> = {
  GROWING: { label: 'Growing', icon: TrendingUp, bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-300' },
  STABLE: { label: 'Stable', icon: Shield, bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
  AT_RISK: { label: 'At Risk', icon: AlertTriangle, bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-300' },
};

const TIMELINE_LABELS: Record<string, string> = { NOW: 'Available Now', YEAR_2030: 'By 2030', FUTURE: '2035+' };

function formatSalary(min: number, max: number, currency: string) {
  const fmt = (n: number) => `${currency === 'USD' ? '$' : currency}${(n / 1000).toFixed(0)}k`;
  return `${fmt(min)} – ${fmt(max)}`;
}

function JobCard({ job }: { job: CareerJobCard }) {
  const demand = DEMAND_CONFIG[job.demand] || DEMAND_CONFIG.GROWING;
  const DemandIcon = demand.icon;

  return (
    <Link href={`/career-map/${job.id}`} className="group">
      <div className="bg-gradient-to-br from-green-50/80 via-emerald-50/40 to-white dark:from-green-500/[0.06] dark:via-emerald-500/[0.03] dark:to-transparent border border-green-200/60 dark:border-green-500/15 rounded-2xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200 hover:-translate-y-0.5 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${demand.bg} ${demand.text} flex items-center gap-1`}>
            <DemandIcon size={10} /> {demand.label}
          </span>
          <SaveButton contentType="career-job" contentId={job.id} title={job.title} />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          {job.title}
        </h3>
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
          {formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.currency)}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100/80 dark:bg-green-500/10 text-green-700 dark:text-green-300 border border-green-200/40 dark:border-green-500/10">
            {TIMELINE_LABELS[job.timeline]}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
            {job.requiredDegree}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CareerMapPage() {
  const { industries, paths, loading } = useMyCareerPaths();
  const [activeTab, setActiveTab] = useState<string>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-green-50 dark:bg-green-500/5 rounded-lg animate-pulse mx-auto" />
        <div className="flex gap-2 justify-center">
          {[1, 2, 3].map(i => <div key={i} className="h-10 w-28 bg-green-50 dark:bg-green-500/5 rounded-full animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-green-50/50 dark:bg-green-500/[0.03] rounded-2xl border border-green-100 dark:border-green-500/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (industries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
          <Briefcase size={28} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Career Paths Yet</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          Career paths will appear here based on your selected industries.
        </p>
      </div>
    );
  }

  const filteredPaths = activeTab === 'all'
    ? paths
    : paths.filter(p => p.industrySlug === activeTab);

  const allJobs = filteredPaths.flatMap(p => p.jobs);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <Briefcase size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">Jobs in 2035</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Future careers shaped by AI, curated for your industries</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          All ({paths.reduce((acc, p) => acc + p.jobs.length, 0)})
        </button>
        {industries.map(ind => {
          const count = paths.filter(p => p.industrySlug === ind.slug).reduce((acc, p) => acc + p.jobs.length, 0);
          return (
            <button
              key={ind.slug}
              onClick={() => setActiveTab(ind.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === ind.slug
                  ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{ind.icon}</span> {ind.name}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === ind.slug ? 'bg-white/25' : 'bg-gray-200 dark:bg-white/10'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filteredPaths.map(path => (
        <div key={path.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{path.industry.icon}</span>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{path.title}</h2>
            <span className="text-xs text-gray-400 dark:text-slate-500">{path.jobs.length} jobs</span>
          </div>
          {path.jobs.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 pl-8">No jobs added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {path.jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      ))}

      {allJobs.length === 0 && (
        <div className="text-center py-14">
          <p className="text-sm text-gray-400 dark:text-slate-500">No jobs in this category yet.</p>
        </div>
      )}
    </div>
  );
}
