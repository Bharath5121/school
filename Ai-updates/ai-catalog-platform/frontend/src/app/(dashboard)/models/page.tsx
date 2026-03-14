'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';
import { CARD_PALETTES } from '@/lib/card-palettes';

interface Model {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  builtByRole: string;
  modelType: string;
  difficultyLevel: string;
  isFree: boolean;
  tryUrl: string | null;
  notebookLmUrl: string | null;
  careerImpact: string;
  tags: string[];
  industry: { name: string; slug: string; icon: string; color: string };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [freeFilter, setFreeFilter] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (freeFilter) params.set('isFree', freeFilter);
    params.set('limit', '50');

    fetch(`/api/home/models?${params}`)
      .then(r => r.json())
      .then(res => { if (res.data) setModels(res.data); })
      .catch((err: any) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [search, freeFilter]);

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 p-8 shadow-lg shadow-violet-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Models</h1>
          <p className="text-indigo-100 text-sm mt-1">Explore AI models across all industries</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search models..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 text-gray-900 dark:text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40" />
        <select value={freeFilter} onChange={e => setFreeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-slate-800/60 text-sm text-slate-500 dark:text-slate-400 focus:outline-none">
          <option value="">All</option>
          <option value="true">Free</option>
          <option value="false">Paid</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-20 text-slate-600">No models found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {models.map((model, idx) => {
            const p = CARD_PALETTES[idx % CARD_PALETTES.length];
            return (
              <Link key={model.id} href={`/models/${model.id}`} className="block group">
                <div className={`p-5 rounded-2xl border ${p.border} ${p.bg} shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: p.glow }} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span>{model.industry.icon}</span>
                      <h3 className={`text-sm font-bold text-gray-900 dark:text-white ${p.hover} transition-colors`}>{model.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${model.isFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        {model.isFree ? 'Free' : 'Paid'}
                      </span>
                      {model.modelType && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tag}`}>{model.modelType}</span>
                      )}
                      {model.difficultyLevel && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[model.difficultyLevel] || ''}`}>{model.difficultyLevel}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-500 mb-2">
                      Built by {model.builtBy}{model.builtByRole ? ` · ${model.builtByRole}` : ''}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-grow">{model.description}</p>
                    {model.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {model.tags.slice(0, 4).map(t => <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${p.tag}`}>{t}</span>)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      {model.tryUrl && (
                        <a href={safeExternalUrl(model.tryUrl)} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors font-semibold">
                          Try It
                        </a>
                      )}
                      {model.notebookLmUrl && (
                        <a href={model.notebookLmUrl} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-colors font-semibold">
                          <BookOpen size={12} /> NotebookLM
                        </a>
                      )}
                      <span className={`ml-auto flex items-center gap-1 text-xs ${p.text} font-semibold group-hover:translate-x-0.5 transition-transform`}>
                        Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
