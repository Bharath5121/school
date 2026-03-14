'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, Bot, Cpu, FileText, Bookmark, ArrowRight, MessageCircle, Sparkles, Zap, GraduationCap } from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { safeExternalUrl } from '@/lib/url';
import { ChatPanel } from '@/features/curriculum/ChatPanel';
import { NotebookGrid } from '@/features/notebooks/components/NotebookGrid';
import { CARD_PALETTES } from '@/lib/card-palettes';
import type { Notebook } from '@/features/notebooks/types';

type Tab = 'notebooks' | 'models' | 'agents' | 'chat' | 'docs';


interface ModelItem {
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
  industry: { name: string; slug: string; icon: string; color: string };
}

interface AgentItem {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  builtByRole: string;
  agentType: string;
  difficultyLevel: string;
  isFree: boolean;
  tryUrl: string | null;
  notebookLmUrl: string | null;
  industry: { name: string; slug: string; icon: string; color: string };
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'notebooks', label: 'Notebooks', icon: <BookOpen size={16} /> },
  { key: 'models', label: 'Models', icon: <Cpu size={16} /> },
  { key: 'agents', label: 'Agents', icon: <Bot size={16} /> },
  { key: 'chat', label: 'Chat', icon: <MessageCircle size={16} /> },
  { key: 'docs', label: 'Docs', icon: <FileText size={16} /> },
];

const DIFFICULTY_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  Advanced: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

const MODEL_TYPE_COLORS: Record<string, string> = {
  LLM: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-500/20',
  Vision: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-500/20',
  NLP: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-500/20',
  Multimodal: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-500/20',
};

const AGENT_TYPE_COLORS: Record<string, string> = {
  Autonomous: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20',
  Copilot: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200/60 dark:border-teal-500/20',
  Assistant: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20',
};

export default function CurriculumPage() {
  const { accessToken } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('notebooks');
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (activeTab === 'notebooks') {
      fetch('/api/notebooks/published')
        .then(r => r.json())
        .then(res => { if (res.data) setNotebooks(res.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === 'models') {
      fetch('/api/home/models?limit=50')
        .then(r => r.json())
        .then(res => { if (res.data) setModels(res.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === 'agents') {
      fetch('/api/home/agents?limit=50')
        .then(r => r.json())
        .then(res => { if (res.data) setAgents(res.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/student/saved-content', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          const all = new Set<string>();
          res.data.forEach((b: any) => all.add(`${b.contentType}:${b.contentId}`));
          setSavedIds(all);
        }
      }).catch(() => {});
  }, [accessToken]);

  const toggleSave = useCallback(async (type: string, id: string, title: string, url?: string | null) => {
    if (!accessToken) return;
    const key = `${type}:${id}`;
    if (savedIds.has(key)) {
      await fetch(`/api/student/saved-content/${type}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
      setSavedIds(prev => { const n = new Set(Array.from(prev)); n.delete(key); return n; });
    } else {
      await fetch('/api/student/saved-content', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: type, contentId: id, title, url }),
      });
      setSavedIds(prev => new Set([...Array.from(prev), key]));
    }
  }, [accessToken, savedIds]);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-lg shadow-indigo-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Curriculum</h1>
            <p className="text-indigo-100 text-sm mt-1">Your learning hub for AI models, agents, notebooks, and live discussions</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading && activeTab !== 'chat' ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'notebooks' && (
            <NotebookGrid notebooks={notebooks} />
          )}

          {activeTab === 'models' && (
            <div>
              {models.length === 0 ? (
                <div className="text-center py-16">
                  <Cpu size={40} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No models available</p>
                  <p className="text-sm text-slate-500">Check back when models are published.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {models.map((model, idx) => {
                    const p = CARD_PALETTES[idx % CARD_PALETTES.length];
                    const saveKey = `MODEL:${model.id}`;
                    const isSaved = savedIds.has(saveKey);
                    const diff = DIFFICULTY_CONFIG[model.difficultyLevel];
                    const typeColor = MODEL_TYPE_COLORS[model.modelType] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-gray-500/20';
                    return (
                      <div key={model.id} className={`group relative p-5 rounded-2xl border ${p.border} ${p.bg} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-3xl" style={{ background: p.glow }} />

                        <div className="flex items-center justify-between mb-3 relative">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-lg">{model.industry.icon}</span>
                            {model.modelType && (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
                                {model.modelType}
                              </span>
                            )}
                            {diff && (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${diff.bg} ${diff.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                                {model.difficultyLevel}
                              </span>
                            )}
                            {model.isFree && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Free</span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSave('MODEL', model.id, model.name, model.tryUrl)}
                            className={`p-1.5 rounded-lg transition-all ${isSaved ? p.save : 'text-slate-400 hover:text-indigo-500'}`}
                          >
                            <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <Link href={`/models/${model.id}`} className="block mb-1">
                          <h3 className={`text-[15px] font-bold text-gray-900 dark:text-white ${p.hover} transition-colors leading-snug`}>{model.name}</h3>
                        </Link>
                        <p className="text-[11px] text-slate-500 mb-2.5">
                          by {model.builtBy}{model.builtByRole ? ` · ${model.builtByRole}` : ''}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">{model.description}</p>

                        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/60">
                          <Link href={`/models/${model.id}`}
                            className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg ${p.btn} font-semibold transition-colors`}>
                            <Sparkles size={12} /> Details <ArrowRight size={11} />
                          </Link>
                          {model.tryUrl && (
                            <a href={safeExternalUrl(model.tryUrl)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold transition-colors">
                              <Zap size={12} /> Try It
                            </a>
                          )}
                          {model.notebookLmUrl && (
                            <a href={model.notebookLmUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-semibold transition-colors ml-auto">
                              <BookOpen size={11} /> NB
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              {agents.length === 0 ? (
                <div className="text-center py-16">
                  <Bot size={40} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No agents available</p>
                  <p className="text-sm text-slate-500">Check back when agents are published.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {agents.map((agent, idx) => {
                    const p = CARD_PALETTES[idx % CARD_PALETTES.length];
                    const saveKey = `AGENT:${agent.id}`;
                    const isSaved = savedIds.has(saveKey);
                    const diff = DIFFICULTY_CONFIG[agent.difficultyLevel];
                    const typeColor = AGENT_TYPE_COLORS[agent.agentType] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-gray-500/20';
                    return (
                      <div key={agent.id} className={`group relative p-5 rounded-2xl border ${p.border} ${p.bg} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-3xl" style={{ background: p.glow }} />

                        <div className="flex items-center justify-between mb-3 relative">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-lg">{agent.industry.icon}</span>
                            {agent.agentType && (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeColor}`}>
                                {agent.agentType}
                              </span>
                            )}
                            {diff && (
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${diff.bg} ${diff.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                                {agent.difficultyLevel}
                              </span>
                            )}
                            {agent.isFree && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Free</span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleSave('AGENT', agent.id, agent.name, agent.tryUrl)}
                            className={`p-1.5 rounded-lg transition-all ${isSaved ? p.save : 'text-slate-400 hover:text-indigo-500'}`}
                          >
                            <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <Link href={`/agents/${agent.id}`} className="block mb-1">
                          <h3 className={`text-[15px] font-bold text-gray-900 dark:text-white ${p.hover} transition-colors leading-snug`}>{agent.name}</h3>
                        </Link>
                        <p className="text-[11px] text-slate-500 mb-2.5">
                          by {agent.builtBy}{agent.builtByRole ? ` · ${agent.builtByRole}` : ''}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">{agent.description}</p>

                        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/60">
                          <Link href={`/agents/${agent.id}`}
                            className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg ${p.btn} font-semibold transition-colors`}>
                            <Sparkles size={12} /> Details <ArrowRight size={11} />
                          </Link>
                          {agent.tryUrl && (
                            <a href={safeExternalUrl(agent.tryUrl)} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold transition-colors">
                              <Zap size={12} /> Try It
                            </a>
                          )}
                          {agent.notebookLmUrl && (
                            <a href={agent.notebookLmUrl} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 font-semibold transition-colors ml-auto">
                              <BookOpen size={11} /> NB
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && <ChatPanel />}

          {activeTab === 'docs' && (
            <div className="text-center py-16">
              <FileText size={40} className="mx-auto mb-3 text-slate-400" />
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Documentation & Resources</p>
              <p className="text-sm text-slate-500 mb-6">Explore our learning guides and documentation.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/guides"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-indigo-500/20 transition-colors">
                  <FileText size={16} /> Learning Guides <ArrowRight size={14} />
                </Link>
                <Link href="/basics"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold text-sm hover:bg-cyan-500/20 transition-colors">
                  <BookOpen size={16} /> AI Basics <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
