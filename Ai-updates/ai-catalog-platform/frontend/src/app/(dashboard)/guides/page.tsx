'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/app.store';
import { Bookmark } from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeRequired: string;
  toolsNeeded: string[];
  whatYouLearn: string;
  steps: string;
  industry: { name: string; slug: string; icon: string; color: string };
}

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  useCase: string;
  category: string;
  industry: { name: string; slug: string; icon: string };
}

const DIFF_CONFIG: Record<string, { badge: string; gradient: string; glow: string; border: string; tint: string }> = {
  BEGINNER: {
    badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-600',
    glow: '#10b981',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    tint: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]',
  },
  INTERMEDIATE: {
    badge: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
    gradient: 'from-amber-500 to-orange-600',
    glow: '#f59e0b',
    border: 'border-amber-200 dark:border-amber-500/20',
    tint: 'bg-amber-100/60 dark:bg-amber-500/[0.06]',
  },
  ADVANCED: {
    badge: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30',
    gradient: 'from-rose-500 to-pink-600',
    glow: '#f43f5e',
    border: 'border-rose-200 dark:border-rose-500/20',
    tint: 'bg-rose-100/60 dark:bg-rose-500/[0.06]',
  },
};

export default function GuidesPage() {
  const { accessToken } = useAppStore();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tab, setTab] = useState<'guides' | 'prompts'>('guides');
  const [diffFilter, setDiffFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (diffFilter) params.set('difficulty', diffFilter);
    params.set('limit', '50');

    Promise.all([
      fetch(`/api/home/guides?${params}`).then(r => r.json()),
      fetch('/api/home/prompts?limit=50').then(r => r.json()),
    ]).then(([gRes, pRes]) => {
      if (gRes.data) setGuides(gRes.data);
      if (pRes.data) setPrompts(pRes.data);
    }).catch((err: any) => setError(err.message || 'Failed to load data')).finally(() => setLoading(false));
  }, [search, diffFilter]);

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/student/saved-content?contentType=GUIDE', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => {
        if (res.data) setSavedIds(prev => new Set([...Array.from(prev), ...res.data.map((b: any) => b.contentId)]));
      }).catch(() => {});
    fetch('/api/student/saved-content?contentType=PROMPT', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => {
        if (res.data) setSavedIds(prev => new Set([...Array.from(prev), ...res.data.map((b: any) => b.contentId)]));
      }).catch(() => {});
  }, [accessToken]);

  const toggleSave = useCallback(async (type: 'GUIDE' | 'PROMPT', id: string, title: string) => {
    if (!accessToken) return;
    if (savedIds.has(id)) {
      await fetch(`/api/student/saved-content/${type}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      setSavedIds(prev => { const n = new Set(Array.from(prev)); n.delete(id); return n; });
    } else {
      await fetch('/api/student/saved-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: type, contentId: id, title }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), id]));
    }
  }, [accessToken, savedIds]);

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-8 shadow-lg shadow-blue-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Career Guide</h1>
            <p className="text-cyan-100 text-sm mt-0.5">Step-by-step guides and ready-made AI prompts to accelerate your career</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('guides')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            tab === 'guides'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/25'
              : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
          }`}>
          Guides ({guides.length})
        </button>
        <button onClick={() => setTab('prompts')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            tab === 'prompts'
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm shadow-violet-500/25'
              : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
          }`}>
          Prompts ({prompts.length})
        </button>
      </div>

      {tab === 'guides' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder="Search guides..." value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-700/40 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all" />
            <div className="flex gap-2">
              {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(d => (
                <button key={d} onClick={() => setDiffFilter(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    diffFilter === d
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
                  }`}>
                  {d || 'All'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl">💡</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No guides found</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {guides.map(guide => {
                const diff = DIFF_CONFIG[guide.difficulty] || DIFF_CONFIG.BEGINNER;
                const isExpanded = expandedGuide === guide.id;
                const isSaved = savedIds.has(guide.id);
                return (
                  <div key={guide.id} className={`relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden min-h-[220px] ${
                    isExpanded
                      ? 'col-span-full border-cyan-200 dark:border-cyan-500/30 bg-cyan-100/60 dark:bg-cyan-500/[0.06]'
                      : `${diff.border} ${diff.tint} shadow-sm hover:shadow-md`
                  }`}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: diff.glow }} />
                    <div className="relative flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${diff.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                            <span className="text-lg">{guide.industry.icon}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{guide.title}</h3>
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${diff.badge}`}>{guide.difficulty}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-slate-500 mt-0.5">{guide.industry.name}</p>
                          </div>
                        </div>
                        <button onClick={() => toggleSave('GUIDE', guide.id, guide.title)}
                          className={`p-1.5 rounded-lg transition-all shrink-0 ${isSaved ? 'text-cyan-500' : 'text-gray-400 dark:text-slate-600 hover:text-cyan-500'}`}>
                          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-3">{guide.description}</p>

                      {/* What You'll Learn preview */}
                      {guide.whatYouLearn && (
                        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-100 dark:border-cyan-500/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">What You&apos;ll Learn</p>
                          <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-2">{guide.whatYouLearn}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-600 mb-4">
                        <span className="font-medium bg-gray-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg">{guide.timeRequired}</span>
                        <span>Tools: {guide.toolsNeeded.join(', ')}</span>
                      </div>
                      <div className="mt-auto">
                        <button onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                            isExpanded
                              ? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm shadow-cyan-500/20 hover:shadow-md'
                          }`}>
                          {isExpanded ? 'Hide Steps' : 'Start Guide'} &rarr;
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="mt-5 space-y-3">
                          {(() => { try { return JSON.parse(guide.steps); } catch { return []; } })().map((step: any) => (
                            <div key={step.step} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#0B0F19] border border-gray-100 dark:border-slate-700/30">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                                <span className="text-xs font-black text-white">{step.step}</span>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">{step.title}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">{step.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {prompts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">No prompts available</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Prompts will appear here as they are added.</p>
            </div>
          ) : prompts.map(prompt => {
            const isSaved = savedIds.has(prompt.id);
            return (
              <div key={prompt.id} className="p-6 rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-100/60 dark:bg-violet-500/[0.06] shadow-sm hover:shadow-md transition-all duration-300 min-h-[200px] flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-sm">{prompt.industry.icon}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{prompt.title}</h3>
                    <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-500/20">{prompt.category}</span>
                  </div>
                  <button onClick={() => toggleSave('PROMPT', prompt.id, prompt.title)}
                    className={`p-1.5 rounded-lg transition-all shrink-0 ${isSaved ? 'text-violet-500' : 'text-gray-400 dark:text-slate-600 hover:text-violet-500'}`}>
                    <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">{prompt.useCase}</p>
                <pre className="text-xs text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-[#0B0F19] p-4 rounded-xl whitespace-pre-wrap font-sans border border-gray-100 dark:border-slate-700/30 mb-3 flex-1">{prompt.prompt}</pre>
                <div className="mt-auto">
                  <button onClick={() => copyPrompt(prompt.id, prompt.prompt)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                      copiedId === prompt.id
                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-gray-100 dark:border-slate-700/40 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-500/20'
                    }`}>
                    {copiedId === prompt.id ? '✓ Copied!' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
