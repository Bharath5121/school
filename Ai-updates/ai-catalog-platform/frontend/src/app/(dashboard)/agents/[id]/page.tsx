'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, BookOpen, Youtube, GraduationCap, Play, Code2, Globe } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';

interface AgentDetail {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  builtByRole: string;
  difficultyLevel: string;
  gradeLevel: string[];
  agentType: string;
  whatItDoes: string;
  whatItAutomates: string;
  humanJobItHelps: string;
  humanPartnership: string;
  skillsNeeded: string[];
  inputType: string[];
  outputType: string[];
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
  industry: { name: string; slug: string; icon: string; color: string };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const AGENT_TYPE_COLORS: Record<string, string> = {
  Autonomous: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  Copilot: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  Assistant: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/home/agents/${id}`)
      .then(r => r.json())
      .then(res => { if (res.data) setAgent(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!agent) return (
    <div className="text-center py-20">
      <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">Agent not found</p>
      <Link href="/agents" className="text-sm text-teal-500 hover:underline">Back to Agents</Link>
    </div>
  );

  const diffClass = DIFFICULTY_COLORS[agent.difficultyLevel] || DIFFICULTY_COLORS.Beginner;
  const typeClass = AGENT_TYPE_COLORS[agent.agentType] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Agents
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 p-8 shadow-lg shadow-teal-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-2xl">{agent.industry.icon}</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">{agent.industry.name}</span>
            {agent.agentType && <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${typeClass}`}>{agent.agentType}</span>}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${agent.isFree ? 'bg-emerald-400/20 text-emerald-100' : 'bg-amber-400/20 text-amber-100'}`}>
              {agent.isFree ? 'Free' : 'Paid'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{agent.name}</h1>
          <p className="text-teal-100 text-sm">
            Built by <span className="font-semibold text-white">{agent.builtBy}</span>
            {agent.builtByRole && <> &middot; {agent.builtByRole}</>}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${diffClass}`}>{agent.difficultyLevel}</span>
            {agent.gradeLevel.length > 0 && (
              <span className="text-xs font-medium text-teal-200">Grades: {agent.gradeLevel.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Overview</h2>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-4">{agent.description}</p>
        {agent.whatItDoes && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What It Does</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{agent.whatItDoes}</p>
          </div>
        )}
        {agent.whatItAutomates && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What It Automates</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{agent.whatItAutomates}</p>
          </div>
        )}
        {agent.humanPartnership && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">Human Partnership</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{agent.humanPartnership}</p>
          </div>
        )}
        {agent.realWorldExample && (
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-500/[0.06] border border-teal-200 dark:border-teal-500/20">
            <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">Real World Example</h3>
            <p className="text-sm text-teal-700 dark:text-teal-300">{agent.realWorldExample}</p>
          </div>
        )}
      </section>

      {/* Technical */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Technical Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {agent.agentType && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Agent Type</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{agent.agentType}</div>
            </div>
          )}
          {agent.difficultyLevel && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Difficulty</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{agent.difficultyLevel}</div>
            </div>
          )}
          {agent.humanJobItHelps && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Helps With</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{agent.humanJobItHelps}</div>
            </div>
          )}
        </div>
        {(agent.inputType.length > 0 || agent.outputType.length > 0) && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {agent.inputType.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Input Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.inputType.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {agent.outputType.length > 0 && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Output Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.outputType.map(t => (
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
        {agent.skillsNeeded.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Skills Needed</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.skillsNeeded.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">{s}</span>
              ))}
            </div>
          </div>
        )}
        {agent.whatToLearnFirst && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">What To Learn First</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{agent.whatToLearnFirst}</p>
          </div>
        )}
        {agent.useCaseTags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-2">Use Cases</h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.useCaseTags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">{t}</span>
              ))}
            </div>
          </div>
        )}
        {agent.careerImpact && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Career Impact</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">{agent.careerImpact}</p>
          </div>
        )}
      </section>

      {/* Resources */}
      <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Resources</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {agent.tryUrl && (
            <a href={safeExternalUrl(agent.tryUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06] hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors">
              <Play size={16} className="text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Try It</span>
              <ExternalLink size={12} className="ml-auto text-emerald-400" />
            </a>
          )}
          {agent.notebookLmUrl && (
            <a href={agent.notebookLmUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/[0.06] hover:bg-indigo-100 dark:hover:bg-indigo-500/10 transition-colors">
              <BookOpen size={16} className="text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">NotebookLM</span>
              <ExternalLink size={12} className="ml-auto text-indigo-400" />
            </a>
          )}
          {agent.youtubeUrl && (
            <a href={safeExternalUrl(agent.youtubeUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06] hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors">
              <Youtube size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">YouTube</span>
              <ExternalLink size={12} className="ml-auto text-red-400" />
            </a>
          )}
          {agent.udemyUrl && (
            <a href={safeExternalUrl(agent.udemyUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/[0.06] hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-colors">
              <GraduationCap size={16} className="text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Udemy</span>
              <ExternalLink size={12} className="ml-auto text-purple-400" />
            </a>
          )}
          {agent.sourceUrl && (
            <a href={safeExternalUrl(agent.sourceUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
              <Code2 size={16} className="text-slate-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Source</span>
              <ExternalLink size={12} className="ml-auto text-slate-400" />
            </a>
          )}
          {agent.huggingFaceUrl && (
            <a href={safeExternalUrl(agent.huggingFaceUrl)} target="_blank" rel="noopener noreferrer"
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
