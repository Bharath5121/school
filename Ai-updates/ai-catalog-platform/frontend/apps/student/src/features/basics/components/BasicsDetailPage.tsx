'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, Lightbulb, BookOpen, CheckCircle2, ArrowLeft, Send, Cpu, Bot, Blocks, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { safeExternalUrl } from '@/lib/url';
import { useBasicsDetail } from '../hooks/useBasics';
import { basicsApi } from '../services/basics.api';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';
import type { BasicsTopicChatMsg } from '../types/basics.types';

type TabId = 'overview' | 'watch' | 'read' | 'takeaways' | 'notebook' | 'architecture' | 'models' | 'apps' | 'chat';

interface TabDef { id: TabId; label: string; emoji: string }

export const BasicsDetailPage = ({ slug }: { slug: string }) => {
  const { topic, loading } = useBasicsDetail(slug);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [chatMessages, setChatMessages] = useState<BasicsTopicChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && slug) {
      basicsApi.getChatMessages(slug).then(setChatMessages);
    }
  }, [activeTab, slug]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    const msg = await basicsApi.sendChatMessage(slug, chatInput.trim());
    if (msg) setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setChatLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-40 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" />)}</div>
        <div className="h-72 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">📚</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Topic Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">This basics topic doesn&apos;t exist yet.</p>
        <Link href="/basics" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
          Back to Basics
        </Link>
      </div>
    );
  }

  const hasVideos = topic.videos.length > 0 || !!topic.videoUrl;
  const hasArticles = topic.articles.length > 0;
  const hasConcepts = topic.concepts.length > 0;
  const hasTakeaways = topic.keyTakeaways.length > 0;
  const hasNotebook = !!topic.notebookLmUrl;
  const hasArchitecture = !!topic.architectureDescription;
  const models = topic.links?.filter(l => l.type === 'MODEL') || [];
  const agents = topic.links?.filter(l => l.type === 'AGENT') || [];
  const apps = topic.links?.filter(l => l.type === 'APP') || [];
  const hasModelsAgents = models.length > 0 || agents.length > 0;
  const hasApps = apps.length > 0;

  const tabs: TabDef[] = [
    { id: 'overview', label: 'Overview', emoji: '📋' },
    ...(hasVideos ? [{ id: 'watch' as TabId, label: 'Watch', emoji: '🎬' }] : []),
    ...(hasArticles ? [{ id: 'read' as TabId, label: 'Read', emoji: '📖' }] : []),
    ...(hasNotebook ? [{ id: 'notebook' as TabId, label: 'Notebook', emoji: '📓' }] : []),
    ...(hasArchitecture ? [{ id: 'architecture' as TabId, label: 'Architecture', emoji: '🏗' }] : []),
    ...(hasModelsAgents ? [{ id: 'models' as TabId, label: 'Models & Agents', emoji: '🤖' }] : []),
    ...(hasApps ? [{ id: 'apps' as TabId, label: 'Apps', emoji: '📱' }] : []),
    ...(hasTakeaways ? [{ id: 'takeaways' as TabId, label: 'Takeaways', emoji: '✅' }] : []),
    { id: 'chat', label: 'Chat', emoji: '💬' },
  ];

  return (
    <div>
      <HistoryTracker contentType="basic" contentId={slug} title={topic.title} slug={topic.slug} />
      {/* Back */}
      <Link href="/basics" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5">
        <ArrowLeft size={16} />
        Back to Basics
      </Link>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white dark:from-emerald-500/[0.05] dark:via-green-500/[0.03] dark:to-transparent border border-emerald-100/80 dark:border-emerald-500/15 p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm capitalize">{topic.difficulty}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">+{topic.xp} XP</span>
        </div>
        <div className="flex items-start gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {topic.title}
          </h1>
          <SaveButton contentType="basic" contentId={topic.id} title={topic.title} metadata={{ slug: topic.slug }} size="md" />
        </div>
        <p className="text-sm text-gray-600 dark:text-white/50 mt-3 leading-relaxed max-w-2xl">{topic.tagline}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 sm:p-8 mb-12 shadow-sm">

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {topic.description && (
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">{topic.description}</p>
            )}
            {hasConcepts && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-amber-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Concepts</h2>
                </div>
                <div className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-2xl p-5">
                  <ul className="space-y-2.5">
                    {topic.concepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5 shrink-0"><CheckCircle2 size={16} /></span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Watch Tab ── */}
        {activeTab === 'watch' && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Play size={18} className="text-rose-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Watch & Learn</h2>
            </div>

            {topic.videoUrl && (
              <div className="mb-6">
                <div className="aspect-video rounded-xl overflow-hidden bg-black border border-emerald-100/30 dark:border-emerald-500/10">
                  <iframe
                    src={topic.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={topic.videoTitle || 'Featured Video'}
                  />
                </div>
                {topic.videoTitle && (
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-3">{topic.videoTitle}</p>
                )}
              </div>
            )}

            {topic.videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topic.videos.map((video, i) => (
                  <a key={i} href={safeExternalUrl(video.url)} target="_blank" rel="noopener noreferrer" className="group block">
                    <div className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all duration-200">
                      <div className="w-full h-28 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-lg mb-3 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/15 transition-colors">
                        <Play size={28} className="text-emerald-500/60 group-hover:text-red-400 transition-colors" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{video.title}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{video.channel}</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Read Tab ── */}
        {activeTab === 'read' && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={18} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Read & Explore</h2>
            </div>
            <div className="space-y-2">
              {topic.articles.map((article, i) => (
                <a key={i} href={safeExternalUrl(article.url)} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all duration-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{article.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{article.source}</p>
                  </div>
                  <ExternalLink size={15} className="text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Notebook Tab ── */}
        {activeTab === 'notebook' && hasNotebook && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📓 NotebookLM
            </h2>
            {topic.notebookDescription && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{topic.notebookDescription}</p>
            )}
            <a href={safeExternalUrl(topic.notebookLmUrl!)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
              Open NotebookLM
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* ── Architecture Tab ── */}
        {activeTab === 'architecture' && hasArchitecture && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              🏗 Architecture
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {topic.architectureDescription!.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {topic.architectureDiagramUrl && (
              <div className="rounded-xl overflow-hidden border border-emerald-100/60 dark:border-emerald-500/10">
                <img src={topic.architectureDiagramUrl} alt="Architecture diagram" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

        {/* ── Models & Agents Tab ── */}
        {activeTab === 'models' && hasModelsAgents && (
          <div className="space-y-6">
            {models.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Cpu size={16} className="text-emerald-500" /> AI Models
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {models.map(m => (
                    <div key={m.id} className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</h4>
                      {m.description && <p className="text-xs text-slate-500 mt-1">{m.description}</p>}
                      {m.redirectUrl && (
                        <a href={safeExternalUrl(m.redirectUrl)} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline mt-2 inline-flex items-center gap-1">
                          Visit <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {agents.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Bot size={16} className="text-emerald-500" /> AI Agents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {agents.map(a => (
                    <div key={a.id} className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{a.name}</h4>
                      {a.description && <p className="text-xs text-slate-500 mt-1">{a.description}</p>}
                      {a.redirectUrl && (
                        <a href={safeExternalUrl(a.redirectUrl)} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline mt-2 inline-flex items-center gap-1">
                          Visit <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Apps Tab ── */}
        {activeTab === 'apps' && hasApps && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Blocks size={16} className="text-emerald-500" /> Related Apps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {apps.map(app => (
                <div key={app.id} className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{app.name}</h4>
                  {app.description && <p className="text-xs text-slate-500 mt-1">{app.description}</p>}
                  {app.redirectUrl && (
                    <a href={safeExternalUrl(app.redirectUrl)} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline mt-2 inline-flex items-center gap-1">
                      Open App <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Takeaways Tab ── */}
        {activeTab === 'takeaways' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> Key Takeaways
            </h2>
            <div className="bg-emerald-50/50 dark:bg-emerald-500/[0.04] border border-emerald-100/70 dark:border-emerald-500/10 rounded-2xl p-6">
              <ul className="space-y-3">
                {topic.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Chat Tab ── */}
        {activeTab === 'chat' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-500" /> Discussion
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 scrollbar-thin">
              {chatMessages.length === 0 && (
                <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-8">No messages yet. Start the conversation!</p>
              )}
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{msg.user.name}</span>
                    <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{msg.message}</p>
                  {msg.response && (
                    <div className="mt-2 pl-3 border-l-2 border-emerald-300 dark:border-emerald-500/40">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{msg.response}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask a question or share a thought..."
                className="flex-1 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-40 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
