'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookOpen, Youtube, GraduationCap, Play, Code2, Globe } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';

interface ModelDetail {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  builtByRole: string;
  difficultyLevel: string;
  gradeLevel: string[];
  modelType: string;
  releaseYear: string;
  parameters: string;
  inputType: string[];
  outputType: string[];
  whatItDoes: string;
  whatItAutomates: string;
  skillsNeeded: string[];
  useCaseTags: string[];
  careerImpact: string;
  whatToLearnFirst: string;
  realWorldExample: string;
  isFree: boolean;
  tryUrl: string | null;
  notebookLmUrl: string | null;
  youtubeUrl: string | null;
  udemyUrl: string | null;
  sourceUrl: string | null;
  huggingFaceUrl: string | null;
  whatToLearn: string[];
  tags: string[];
  industry: { name: string; slug: string; icon: string; color: string };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/home/models/${id}`)
      .then(r => r.json())
      .then(res => { if (res.data) setModel(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!model) return (
    <div className="text-center py-20">
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Model not found</p>
      <Link href="/models" className="text-sm text-violet-500 hover:underline">Back to Models</Link>
    </div>
  );

  const diffClass = DIFFICULTY_COLORS[model.difficultyLevel] || DIFFICULTY_COLORS.Beginner;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link href="/models" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Models
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-8 shadow-lg shadow-violet-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-2xl">{model.industry.icon}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{model.industry.name}</span>
            {model.modelType && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{model.modelType}</span>}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${model.isFree ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'}`}>
              {model.isFree ? 'Free' : 'Paid'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{model.name}</h1>
          <p className="text-violet-100 text-sm">
            Built by <span className="font-semibold text-white">{model.builtBy}</span>
            {model.builtByRole && <> &middot; {model.builtByRole}</>}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${diffClass}`}>{model.difficultyLevel}</span>
            {model.gradeLevel.length > 0 && (
              <span className="text-xs font-medium text-violet-200">Grades: {model.gradeLevel.join(', ')}</span>
            )}
            {model.releaseYear && <span className="text-xs text-violet-200">Released {model.releaseYear}</span>}
            {model.parameters && <span className="text-xs text-violet-200">{model.parameters} params</span>}
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Overview</h2>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-4">{model.description}</p>
        {model.whatItDoes && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What It Does</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{model.whatItDoes}</p>
          </div>
        )}
        {model.whatItAutomates && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What It Automates</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{model.whatItAutomates}</p>
          </div>
        )}
        {model.realWorldExample && (
          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20">
            <h3 className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-1">Real World Example</h3>
            <p className="text-sm text-violet-700 dark:text-violet-300">{model.realWorldExample}</p>
          </div>
        )}
      </section>

      {/* Technical */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Technical Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {model.modelType && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Type</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{model.modelType}</div>
            </div>
          )}
          {model.parameters && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Parameters</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{model.parameters}</div>
            </div>
          )}
          {model.releaseYear && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Release Year</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{model.releaseYear}</div>
            </div>
          )}
          {model.difficultyLevel && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Difficulty</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{model.difficultyLevel}</div>
            </div>
          )}
        </div>
        {(model.inputType.length > 0 || model.outputType.length > 0) && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {model.inputType.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Input Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {model.inputType.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {model.outputType.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Output Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {model.outputType.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Learning Path */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Learning Path</h2>
        {model.skillsNeeded.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Skills Needed</h3>
            <div className="flex flex-wrap gap-1.5">
              {model.skillsNeeded.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}
        {model.whatToLearnFirst && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What To Learn First</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{model.whatToLearnFirst}</p>
          </div>
        )}
        {model.useCaseTags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Use Cases</h3>
            <div className="flex flex-wrap gap-1.5">
              {model.useCaseTags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">{t}</span>
              ))}
            </div>
          </div>
        )}
        {model.careerImpact && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Career Impact</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">{model.careerImpact}</p>
          </div>
        )}
        {model.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {model.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">#{t}</span>
            ))}
          </div>
        )}
      </section>

      {/* Resources */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {model.tryUrl && (
            <a href={safeExternalUrl(model.tryUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06] hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors">
              <Play size={16} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Try It</span>
              <ExternalLink size={12} className="ml-auto text-emerald-400" />
            </a>
          )}
          {model.notebookLmUrl && (
            <a href={model.notebookLmUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/[0.06] hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors">
              <BookOpen size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">NotebookLM</span>
              <ExternalLink size={12} className="ml-auto text-indigo-400" />
            </a>
          )}
          {model.youtubeUrl && (
            <a href={safeExternalUrl(model.youtubeUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06] hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors">
              <Youtube size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">YouTube</span>
              <ExternalLink size={12} className="ml-auto text-red-400" />
            </a>
          )}
          {model.udemyUrl && (
            <a href={safeExternalUrl(model.udemyUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/[0.06] hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-colors">
              <GraduationCap size={16} className="text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Udemy</span>
              <ExternalLink size={12} className="ml-auto text-purple-400" />
            </a>
          )}
          {model.sourceUrl && (
            <a href={safeExternalUrl(model.sourceUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
              <Code2 size={16} className="text-slate-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Source</span>
              <ExternalLink size={12} className="ml-auto text-slate-400" />
            </a>
          )}
          {model.huggingFaceUrl && (
            <a href={safeExternalUrl(model.huggingFaceUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/[0.06] hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-colors">
              <Globe size={16} className="text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Hugging Face</span>
              <ExternalLink size={12} className="ml-auto text-amber-400" />
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
