'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, MessageSquare, Lightbulb, CheckCircle2, Cpu, AppWindow, Sparkles } from 'lucide-react';
import { useLabItem } from '../hooks/useLab';
import { labApi } from '../services/lab.api';
import type { LabChatMsg } from '../types/lab.types';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

type TabId = 'description' | 'usecases' | 'features' | 'chat' | 'askbuddy';

export function LabItemPage({ categorySlug, itemSlug }: { categorySlug: string; itemSlug: string }) {
  const { item, loading } = useLabItem(itemSlug);
  const [tab, setTab] = useState<TabId>('description');
  const [chatMessages, setChatMessages] = useState<LabChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tab === 'chat' && itemSlug) {
      labApi.getChatMessages(itemSlug).then(setChatMessages);
    }
  }, [tab, itemSlug]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    setChatLoading(true);
    const msg = await labApi.sendChatMessage(itemSlug, chatInput.trim());
    if (msg) setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setChatLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-32 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" />)}</div>
        <div className="h-64 bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔬</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Item Not Found</h2>
        <Link href={`/lab/${categorySlug}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
          Back to Category
        </Link>
      </div>
    );
  }

  const hasUseCases = item.useCases.length > 0;
  const hasFeatures = item.features.length > 0;

  const tabs: { id: TabId; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: 'description', label: 'Description', icon: '📋', show: true },
    { id: 'usecases', label: 'Use Cases', icon: '💡', show: hasUseCases },
    { id: 'features', label: 'Features', icon: '⚙️', show: hasFeatures },
    { id: 'chat', label: 'Chat', icon: '💬', show: true },
    { id: 'askbuddy', label: 'Ask Buddy', icon: '🤖', show: true },
  ];

  return (
    <div>
      <HistoryTracker contentType="lab-item" contentId={itemSlug} title={item.title} slug={item.slug} />
      <Link href={`/lab/${categorySlug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-3">
        <ArrowLeft size={16} /> Back to {item.category.title}
      </Link>

      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white dark:from-emerald-500/[0.05] dark:via-green-500/[0.03] dark:to-transparent border border-emerald-100/80 dark:border-emerald-500/15 px-5 py-4 mb-3">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-3xl">{item.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
              <SaveButton contentType="lab-item" contentId={item.id} title={item.title} metadata={{ slug: item.slug, categorySlug: categorySlug }} size="md" />
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.type === 'MODEL' ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300' : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'}`}>
                {item.type === 'MODEL' ? <><Cpu size={10} className="inline mr-0.5" />Model</> : <><AppWindow size={10} className="inline mr-0.5" />App</>}
              </span>
            </div>
            {item.provider && <p className="text-xs text-slate-500">by {item.provider}</p>}
          </div>
        </div>
        {item.tagline && <p className="text-xs text-gray-600 dark:text-white/50 leading-relaxed">{item.tagline}</p>}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
        {tabs.filter(t => t.show).map(t => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-5 shadow-sm mb-8">
        {tab === 'description' && (
          <div className="space-y-4">
            {item.description ? (
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.description}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No description available yet.</p>
            )}
          </div>
        )}

        {tab === 'usecases' && hasUseCases && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-emerald-400" /> Use Cases
            </h2>
            <div className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-4">
              <ul className="space-y-2">
                {item.useCases.map((uc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'features' && hasFeatures && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" /> Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-lg px-3 py-2.5">
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" /> Discussion
            </h2>
            <div className="space-y-2.5 max-h-80 overflow-y-auto mb-3 scrollbar-thin">
              {chatMessages.length === 0 && (
                <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-6">No messages yet. Start the conversation!</p>
              )}
              {chatMessages.map(msg => (
                <div key={msg.id} className="bg-emerald-50/40 dark:bg-emerald-500/[0.04] border border-emerald-100/60 dark:border-emerald-500/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{msg.user.name}</span>
                    <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{msg.message}</p>
                  {msg.response && (
                    <div className="mt-1.5 pl-3 border-l-2 border-emerald-300 dark:border-emerald-500/40">
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
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask a question or share a thought..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-40 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {tab === 'askbuddy' && (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🤖</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ask Buddy</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Coming soon! You&apos;ll be able to ask deeper questions about <strong>{item.title}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
