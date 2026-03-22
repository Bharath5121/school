'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDiscoveryDetail } from '../hooks/useDiscoveryDetail';
import { OverviewTab } from './tabs/OverviewTab';
import { VideoTab } from './tabs/VideoTab';
import { NotebookTab } from './tabs/NotebookTab';
import { ArchitectureTab } from './tabs/ArchitectureTab';
import { ModelsAgentsTab } from './tabs/ModelsAgentsTab';
import { AppsTab } from './tabs/AppsTab';
import { ChatTab } from './tabs/ChatTab';
import { HistoryTracker } from '@/features/my-stuff/components/HistoryTracker';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

interface Props {
  slug: string;
}

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '📋' },
  { id: 'video', label: 'Video', emoji: '🎬' },
  { id: 'notebook', label: 'Notebook', emoji: '📓' },
  { id: 'architecture', label: 'Architecture', emoji: '🏗️' },
  { id: 'models', label: 'Models & Agents', emoji: '🤖' },
  { id: 'apps', label: 'Apps', emoji: '📱' },
  { id: 'chat', label: 'Chat', emoji: '💬' },
] as const;

type TabId = typeof TABS[number]['id'];

export function DiscoveryDetailPage({ slug }: Props) {
  const { discovery, loading, error } = useDiscoveryDetail(slug);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 bg-emerald-100 dark:bg-emerald-500/10 rounded" />
        <div className="h-40 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10" />
        <div className="flex gap-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl" />)}</div>
        <div className="h-72 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5" />
      </div>
    );
  }

  if (error || !discovery) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <p className="text-4xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Discovery not found</h2>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6">{error || 'This discovery may not exist or is not published yet.'}</p>
        <Link href="/discoveries" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
          Back to Discoveries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <HistoryTracker contentType="discovery" contentId={slug} title={discovery.title} slug={discovery.slug} />
      <Link href="/discoveries" className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-white/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Discoveries
      </Link>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white dark:from-emerald-500/[0.05] dark:via-green-500/[0.03] dark:to-transparent border border-emerald-100/80 dark:border-emerald-500/15 p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {discovery.industry && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm">
              {discovery.industry.icon} {discovery.industry.name}
            </span>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 capitalize">{discovery.difficulty}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">+{discovery.xp} XP</span>
          {discovery.isFeatured && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">⭐ Featured</span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          {discovery.title}
        </h1>
        <div className="mt-2"><SaveButton contentType="discovery" contentId={discovery.id || slug} title={discovery.title} metadata={{ slug: discovery.slug }} size="md" /></div>
        <p className="text-sm text-gray-600 dark:text-white/50 mt-3 leading-relaxed max-w-2xl">{discovery.summary}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {TABS.map(tab => {
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
        {activeTab === 'overview' && <OverviewTab discovery={discovery} />}
        {activeTab === 'video' && <VideoTab discovery={discovery} />}
        {activeTab === 'notebook' && <NotebookTab discovery={discovery} />}
        {activeTab === 'architecture' && <ArchitectureTab discovery={discovery} />}
        {activeTab === 'models' && <ModelsAgentsTab discovery={discovery} />}
        {activeTab === 'apps' && <AppsTab discovery={discovery} />}
        {activeTab === 'chat' && <ChatTab slug={slug} />}
      </div>
    </div>
  );
}
