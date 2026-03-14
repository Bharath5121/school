'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { safeExternalUrl } from '@/lib/url';
import { useDashboard } from '@/features/user-experience/hooks/useDashboard';
import { Bookmark } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: string;
  whyItMatters: string;
  learnUrl: string | null;
  notebookLmUrl: string | null;
  timeToLearn: string;
  category: string;
  industry: { name: string; slug: string; icon: string };
}

interface Progress {
  skillId: string;
  status: string;
}

const LEVEL_CONFIG: Record<string, { label: string; badge: string; barColor: string; gradient: string; border: string; tint: string }> = {
  BEGINNER: {
    label: 'Beginner',
    badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
    barColor: 'from-amber-400 to-yellow-500',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-200 dark:border-amber-500/20',
    tint: 'bg-amber-100/60 dark:bg-amber-500/[0.06]',
  },
  INTERMEDIATE: {
    label: 'Intermediate',
    badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
    barColor: 'from-emerald-400 to-teal-500',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    tint: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]',
  },
  ADVANCED: {
    label: 'Advanced',
    badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
    barColor: 'from-blue-400 to-indigo-500',
    gradient: 'from-blue-500 to-indigo-600',
    border: 'border-blue-200 dark:border-blue-500/20',
    tint: 'bg-blue-100/60 dark:bg-blue-500/[0.06]',
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; selectBg: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'text-gray-500 dark:text-slate-500', bg: 'bg-gray-50 dark:bg-slate-800/50', selectBg: 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700' },
  EXPLORING: { label: 'Exploring', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', selectBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
  LEARNED: { label: 'Learned', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', selectBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
};

export default function SkillsPage() {
  const searchParams = useSearchParams();
  const childId = searchParams.get('childId');
  const isParentView = !!childId;

  const { accessToken } = useAppStore();
  const { data: dashData } = useDashboard<{ user: { interests: string[] } }>('student');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
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
    if (!interests.length || !accessToken) {
      if (!isParentView) setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const progressUrl = isParentView
      ? `/api/parent/child/${childId}/skill-progress`
      : '/api/student/skills';

    Promise.all([
      ...interests.map(slug => fetch(`/api/home/skills/${slug}`).then(r => r.json())),
      fetch(progressUrl, { headers: { Authorization: `Bearer ${accessToken}` } }).then(r => r.json()),
    ]).then(results => {
      const allSkills: Skill[] = [];
      for (let i = 0; i < results.length - 1; i++) {
        if (results[i].data) allSkills.push(...results[i].data);
      }
      setSkills(allSkills);
      const progressRes = results[results.length - 1];
      if (progressRes.data) setProgress(progressRes.data);
    }).catch((err: any) => setError(err.message || 'Failed to load data')).finally(() => setLoading(false));
  }, [interestsKey, interests, accessToken, isParentView, childId]);

  useEffect(() => {
    if (!accessToken || isParentView) return;
    fetch('/api/student/saved-content?contentType=SKILL', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => { if (res.data) setSavedIds(new Set(res.data.map((b: any) => b.contentId))); })
      .catch(() => {});
  }, [accessToken, isParentView]);

  const toggleSave = useCallback(async (skillId: string, title: string) => {
    if (!accessToken || isParentView) return;
    if (savedIds.has(skillId)) {
      await fetch(`/api/student/saved-content/SKILL/${skillId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      setSavedIds(prev => { const n = new Set(Array.from(prev)); n.delete(skillId); return n; });
    } else {
      await fetch('/api/student/saved-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'SKILL', contentId: skillId, title }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), skillId]));
    }
  }, [accessToken, savedIds, isParentView]);

  const updateStatus = async (skillId: string, status: string) => {
    if (!accessToken || isParentView) return;
    await fetch(`/api/student/skills/${skillId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setProgress(prev => {
      const existing = prev.find(p => p.skillId === skillId);
      if (existing) return prev.map(p => p.skillId === skillId ? { ...p, status } : p);
      return [...prev, { skillId, status }];
    });
  };

  const getStatus = (skillId: string) => progress.find(p => p.skillId === skillId)?.status || 'NOT_STARTED';

  const grouped = skills.reduce((acc, s) => {
    acc[s.level] = acc[s.level] || [];
    acc[s.level].push(s);
    return acc;
  }, {} as Record<string, Skill[]>);

  const learnedCount = progress.filter(p => p.status === 'LEARNED').length;
  const exploringCount = progress.filter(p => p.status === 'EXPLORING').length;
  const totalCount = skills.length;
  const learnedPct = totalCount ? Math.round((learnedCount / totalCount) * 100) : 0;

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!interests.length && !isParentView) return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
        <span className="text-3xl">&#x1F9E0;</span>
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No industries selected yet</p>
      <p className="text-sm text-gray-500 dark:text-slate-400">Complete onboarding to select your fields of interest, then track skills here.</p>
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 p-8 shadow-lg shadow-violet-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isParentView ? "Child's Skills Tracker" : 'Skills Tracker'}
          </h1>
          <p className="text-violet-100 text-sm mt-1.5">
            {isParentView ? "Your child's progress in AI skills" : 'Track your progress in AI skills across your fields'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative overflow-hidden p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-emerald-500" />
          <div className="relative">
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{learnedCount}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Learned</p>
          </div>
        </div>
        <div className="relative overflow-hidden p-5 rounded-2xl bg-amber-100/60 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-amber-500" />
          <div className="relative">
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{exploringCount}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Exploring</p>
          </div>
        </div>
        <div className="relative overflow-hidden p-5 rounded-2xl bg-violet-100/60 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 blur-2xl bg-violet-500" />
          <div className="relative">
            <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{totalCount}</p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 mt-1">Total Skills</p>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-500/[0.03] border border-gray-100 dark:border-slate-700/40 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-900 dark:text-white">Mastery Progress</span>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{learnedPct}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-800/50 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/30"
            style={{ width: `${learnedPct}%` }}
          />
        </div>
      </div>

      {/* Skill Groups */}
      {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => {
        const levelSkills = grouped[level];
        if (!levelSkills?.length) return null;
        const config = LEVEL_CONFIG[level];
        return (
          <div key={level}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm`}>
                <span className="text-white text-xs font-black">
                  {level === 'BEGINNER' ? '1' : level === 'INTERMEDIATE' ? '2' : '3'}
                </span>
              </div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">{config.label}</h2>
              <span className="text-xs text-gray-400 dark:text-slate-600">{levelSkills.length} skills</span>
            </div>
            <div className="space-y-3">
              {levelSkills.map(skill => {
                const status = getStatus(skill.id);
                const statusCfg = STATUS_CONFIG[status];
                const isSaved = savedIds.has(skill.id);
                return (
                  <div key={skill.id} className={`p-5 rounded-2xl border transition-all duration-300 min-h-[140px] ${
                    status === 'LEARNED'
                      ? 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-100/60 dark:bg-emerald-500/[0.06]'
                      : `${config.border} ${config.tint} shadow-sm hover:shadow-md`
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {status === 'LEARNED' && (
                            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 animate-bounce">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{skill.name}</h3>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
                          <span className="text-[10px] font-medium text-gray-500 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {skill.industry.icon} {skill.industry.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-2">{skill.description}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 leading-relaxed mb-3">
                          <span className="font-semibold text-gray-500 dark:text-slate-400">Why:</span> {skill.whyItMatters.slice(0, 150)}
                          {skill.whyItMatters.length > 150 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-gray-400 dark:text-slate-600 font-medium">~{skill.timeToLearn}</span>
                          {skill.learnUrl && (
                            <a href={safeExternalUrl(skill.learnUrl)} target="_blank" rel="noopener noreferrer"
                              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                              Learn &rarr;
                            </a>
                          )}
                          {skill.notebookLmUrl && (
                            <a href={safeExternalUrl(skill.notebookLmUrl)} target="_blank" rel="noopener noreferrer"
                              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">
                              NotebookLM &rarr;
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {!isParentView && (
                          <button onClick={() => toggleSave(skill.id, skill.name)}
                            className={`p-1.5 rounded-lg transition-all ${isSaved ? 'text-violet-500' : 'text-gray-400 dark:text-slate-600 hover:text-violet-500'}`}
                            title={isSaved ? 'Unsave' : 'Save'}>
                            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        )}
                        {isParentView ? (
                          <span className={`text-xs font-bold px-4 py-2.5 rounded-xl border ${statusCfg.selectBg} ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        ) : (
                          <>
                            <select
                              value={status}
                              onChange={e => updateStatus(skill.id, e.target.value)}
                              className={`text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer ${statusCfg.selectBg} ${statusCfg.color} transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-violet-500/30`}>
                              <option value="NOT_STARTED">Not Started</option>
                              <option value="EXPLORING">Exploring</option>
                              <option value="LEARNED">Learned</option>
                            </select>
                            <span className={`text-[10px] font-semibold ${statusCfg.color}`}>{statusCfg.label}</span>
                          </>
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

      {skills.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">&#x1F9E0;</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No skills available yet</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Skills for your selected industries will appear here.</p>
        </div>
      )}
    </div>
  );
}
