'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { safeExternalUrl } from '@/lib/url';
import { useDashboard } from '@/features/user-experience/hooks/useDashboard';
import { Bookmark } from 'lucide-react';

interface CareerJob {
  id: string;
  title: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  demand: string;
  requiredDegree: string;
  requiredSkills: string[];
  futureSkills: string[];
  howAiChanges: string;
  googleUrl: string | null;
  notebookLmUrl: string | null;
  timeline: string;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  aiImpactSummary: string;
  industry: { name: string; slug: string; icon: string; color: string };
  jobs: CareerJob[];
}

const DEMAND_BADGES: Record<string, { label: string; className: string }> = {
  GROWING: { label: 'Growing', className: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' },
  STABLE: { label: 'Stable', className: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30' },
  AT_RISK: { label: 'At Risk', className: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30' },
};

const TIMELINE_BADGES: Record<string, { label: string; className: string }> = {
  NOW: { label: 'Today', className: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30' },
  YEAR_2030: { label: '2030', className: 'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30' },
  FUTURE: { label: 'Future', className: 'bg-fuchsia-100 dark:bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-500/30' },
};

const PATH_GRADIENTS = [
  { header: 'from-amber-500 to-orange-600', glow: '#f59e0b', border: 'border-amber-200 dark:border-amber-500/20', tint: 'bg-amber-100/60 dark:bg-amber-500/[0.06]' },
  { header: 'from-emerald-500 to-teal-600', glow: '#10b981', border: 'border-emerald-200 dark:border-emerald-500/20', tint: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]' },
  { header: 'from-blue-500 to-indigo-600', glow: '#3b82f6', border: 'border-blue-200 dark:border-blue-500/20', tint: 'bg-blue-100/60 dark:bg-blue-500/[0.06]' },
];

export default function CareerMapPage() {
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const isParentView = !!childId;

  const { accessToken } = useAppStore();
  const { data: dashData } = useDashboard<{ user: { interests: string[] } }>('student');
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childInterests, setChildInterests] = useState<string[]>([]);

  const interests = useMemo(() => {
    if (isParentView) return childInterests;
    return dashData?.user?.interests || [];
  }, [isParentView, childInterests, dashData]);
  const interestsKey = useMemo(() => interests.join(','), [interests]);

  useEffect(() => {
    if (!isParentView || !accessToken) return;
    fetch(`/api/parent/child/${childId}/interests`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => { if (res.data) setChildInterests(res.data); })
      .catch(() => {});
  }, [isParentView, childId, accessToken]);

  useEffect(() => {
    if (!interests.length || !accessToken) return;
    setLoading(true);
    setError(null);

    const statsUrl = isParentView
      ? `/api/parent/child/${childId}/career-stats`
      : '/api/student/career/stats';

    Promise.all([
      ...interests.map(slug => fetch(`/api/home/careers/${slug}`).then(r => r.json())),
      fetch(statsUrl, { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
    ]).then(results => {
      const allPaths: CareerPath[] = [];
      for (let i = 0; i < results.length - 1; i++) {
        if (results[i].data) allPaths.push(...results[i].data);
      }
      setPaths(allPaths);
      const statsRes = results[results.length - 1];
      if (statsRes.data?.jobIds) setExploredIds(new Set(statsRes.data.jobIds));
    }).catch((err: any) => setError(err.message || 'Failed to load data')).finally(() => setLoading(false));
  }, [interestsKey, interests, accessToken, isParentView, childId]);

  useEffect(() => {
    if (!accessToken || isParentView) return;
    fetch('/api/student/saved-content?contentType=CAREER_JOB', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => { if (res.data) setSavedIds(new Set(res.data.map((b: any) => b.contentId))); })
      .catch(() => {});
  }, [accessToken, isParentView]);

  const toggleSave = useCallback(async (jobId: string, title: string) => {
    if (!accessToken || isParentView) return;
    if (savedIds.has(jobId)) {
      await fetch(`/api/student/saved-content/CAREER_JOB/${jobId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      setSavedIds(prev => { const n = new Set(Array.from(prev)); n.delete(jobId); return n; });
    } else {
      await fetch('/api/student/saved-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'CAREER_JOB', contentId: jobId, title }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), jobId]));
    }
  }, [accessToken, savedIds, isParentView]);

  const markExplored = async (jobId: string) => {
    if (!accessToken || isParentView) return;
    await fetch(`/api/student/career/explored/${jobId}`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
    setExploredIds(prev => { const next = new Set(Array.from(prev)); next.add(jobId); return next; });
  };

  const removeExplored = async (jobId: string) => {
    if (!accessToken || isParentView) return;
    await fetch(`/api/student/career/explored/${jobId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
    setExploredIds(prev => { const next = new Set(Array.from(prev)); next.delete(jobId); return next; });
  };

  const totalJobs = paths.reduce((sum, p) => sum + p.jobs.length, 0);
  const exploredCount = paths.reduce((sum, p) => sum + p.jobs.filter(j => exploredIds.has(j.id)).length, 0);
  const progressPct = totalJobs ? Math.round((exploredCount / totalJobs) * 100) : 0;

  const formatSalary = (min: number, max: number, currency: string) => {
    const sym = currency === 'USD' ? '$' : currency;
    return `${sym}${Math.round(min / 1000)}K - ${sym}${Math.round(max / 1000)}K`;
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8">
        <p className="text-red-600 dark:text-red-400 text-lg font-bold">Something went wrong</p>
        <p className="text-gray-500 dark:text-slate-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2.5 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-xl text-red-700 dark:text-red-400 font-semibold transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Parent breadcrumb */}
      {isParentView && (
        <Link href={`/parent/child/${childId}`}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm">
          &#8592; Back to Child Overview
        </Link>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-lg shadow-purple-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isParentView ? "Child's Career Map" : 'My Career Map'}
          </h1>
          <p className="text-indigo-100 text-sm mt-1.5">
            {isParentView ? "Your child's career exploration progress" : 'AI-powered career paths in your fields of interest'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/[0.03] border border-indigo-100 dark:border-slate-700/40 shadow-sm">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl bg-emerald-500" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <span className="text-white text-lg font-extrabold">{progressPct}%</span>
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-white block">Exploration Progress</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">{exploredCount} of {totalJobs} roles explored</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{progressPct}%</span>
            </div>
          </div>
          <div className="relative w-full bg-gray-100 dark:bg-slate-800/50 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-emerald-500/30 relative"
              style={{ width: `${Math.max(progressPct, 2)}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-gray-400 dark:text-slate-600">Keep exploring to unlock all career insights</p>
            <p className="text-[11px] font-semibold text-emerald-500">{totalJobs - exploredCount} remaining</p>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      {paths.map((path, pathIdx) => {
        const theme = PATH_GRADIENTS[pathIdx % PATH_GRADIENTS.length];
        return (
          <div key={path.id} className="space-y-4">
            {/* Path Header */}
            <div className={`relative overflow-hidden p-6 rounded-2xl border ${theme.border} ${theme.tint} min-h-[120px]`}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: theme.glow }} />
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.header} flex items-center justify-center shrink-0 shadow-md`}>
                  <span className="text-xl text-white">{path.industry.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">{path.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{path.industry.name} &middot; {path.jobs.length} roles</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mt-3">{path.aiImpactSummary}</p>
            </div>

            {/* Jobs */}
            <div className="grid grid-cols-1 gap-4">
              {path.jobs.map(job => {
                const isExplored = exploredIds.has(job.id);
                const isSaved = savedIds.has(job.id);
                const demandBadge = DEMAND_BADGES[job.demand] || DEMAND_BADGES.STABLE;
                const timelineBadge = TIMELINE_BADGES[job.timeline] || TIMELINE_BADGES.NOW;
                return (
                  <div key={job.id} className={`p-6 rounded-2xl border transition-all duration-300 min-h-[180px] ${
                    isExplored
                      ? `border-emerald-200 dark:border-emerald-500/30 bg-emerald-100/60 dark:bg-emerald-500/[0.06]`
                      : `${theme.border} ${theme.tint} shadow-sm hover:shadow-md`
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{job.title}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${timelineBadge.className}`}>{timelineBadge.label}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${demandBadge.className}`}>{demandBadge.label}</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">{formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.currency)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-2">{job.requiredDegree}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-3">{job.howAiChanges}</p>
                        {(job.googleUrl || job.notebookLmUrl) && (
                          <div className="flex items-center gap-3 text-xs mb-3">
                            {job.googleUrl && (
                              <a href={safeExternalUrl(job.googleUrl)} target="_blank" rel="noopener noreferrer"
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                                Google &rarr;
                              </a>
                            )}
                            {job.notebookLmUrl && (
                              <a href={safeExternalUrl(job.notebookLmUrl)} target="_blank" rel="noopener noreferrer"
                                className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">
                                NotebookLM &rarr;
                              </a>
                            )}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {job.requiredSkills.map(s => (
                            <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">{s}</span>
                          ))}
                        </div>
                        {job.futureSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.futureSkills.map(s => (
                              <span key={s} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {!isParentView && (
                          <button onClick={() => toggleSave(job.id, job.title)}
                            className={`p-1.5 rounded-lg transition-all ${isSaved ? 'text-violet-500' : 'text-gray-400 dark:text-slate-600 hover:text-violet-500'}`}
                            title={isSaved ? 'Unsave' : 'Save'}>
                            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        )}
                        {isParentView ? (
                          isExplored ? (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                              &#10003; Explored
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700">
                              Not Explored
                            </span>
                          )
                        ) : (
                          !isExplored ? (
                            <button onClick={() => markExplored(job.id)}
                              className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30 transition-all">
                              Mark Explored
                            </button>
                          ) : (
                            <button onClick={() => removeExplored(job.id)}
                              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:bg-red-100 dark:hover:bg-red-500/15 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/20 transition-all group/btn">
                              <span className="group-hover/btn:hidden">&#10003; Explored</span>
                              <span className="hidden group-hover/btn:inline">&#10005; Unexplore</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {paths.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">&#x1F5FA;&#xFE0F;</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No career paths yet</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Career paths will appear here based on your selected industries.</p>
        </div>
      )}
    </div>
  );
}
