'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useChildData } from '../hooks/useChildData';
import { NotebookActivity } from './sections/NotebookActivity';
import { ActivityFeed } from './sections/ActivityFeed';
import { TimeSpentChart } from './sections/TimeSpentChart';
import { CompletedTopics } from './sections/CompletedTopics';
import { TeacherMessages } from './sections/TeacherMessages';

interface OverviewStats {
  child: { id: string; name: string; gradeLevel: string | null; interests: string[] };
  stats: {
    skillsLearned: number; skillsExploring: number; skillsTotal: number;
    careersExplored: number; careersTotal: number; minutesThisWeek: number; itemsReadThisWeek: number;
    notebooksOpenedThisWeek: number; savedItems: number;
  };
}

const INLINE_TABS = [
  { id: 'notebooks', label: 'Notebooks', icon: '📓' },
  { id: 'activity', label: 'Activity', icon: '📋' },
  { id: 'time', label: 'Time', icon: '⏱️' },
  { id: 'completed', label: 'Completed', icon: '✅' },
  { id: 'messages', label: 'Messages', icon: '💬' },
] as const;

type InlineTabId = typeof INLINE_TABS[number]['id'];

export const ChildOverview = ({ childId }: { childId: string }) => {
  const [activeTab, setActiveTab] = useState<InlineTabId>('notebooks');
  const { data, loading } = useChildData<OverviewStats>(childId, 'overview');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Unable to load child data.</p>
        <Link href="/feed" className="text-blue-500 text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const { child, stats } = data;
  const hours = Math.floor(stats.minutesThisWeek / 60);
  const mins = stats.minutesThisWeek % 60;

  const REDIRECT_TABS = [
    { label: 'Skills', icon: '🧠', href: `/skills?childId=${childId}` },
    { label: 'Career', icon: '🗺️', href: `/career-map?childId=${childId}` },
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/feed" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm">
          &#8592; Dashboard
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-200/60 dark:bg-blue-500/20 flex items-center justify-center text-2xl font-black text-blue-700 dark:text-blue-400">
              {child.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">{child.name}</h1>
              {child.gradeLevel && <p className="text-xs text-slate-500">{child.gradeLevel}</p>}
              {child.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {child.interests.map(i => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-blue-200/40 dark:bg-blue-500/10 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                      {i}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Notebooks Opened', value: String(stats.notebooksOpenedThisWeek), color: 'violet' },
          { label: 'Skills Learned', value: `${stats.skillsLearned} / ${stats.skillsTotal}`, color: 'emerald' },
          { label: 'Careers Explored', value: `${stats.careersExplored} / ${stats.careersTotal}`, color: 'blue' },
          { label: 'Time This Week', value: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`, color: 'cyan' },
          { label: 'Items Read', value: String(stats.itemsReadThisWeek), color: 'amber' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-xl bg-${s.color}-100/60 dark:bg-${s.color}-500/[0.06] border border-${s.color}-200 dark:border-${s.color}-500/20 text-center`}>
            <div className={`text-xl font-black text-${s.color}-700 dark:text-${s.color}-400`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
        {INLINE_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/15'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'
            }`}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        {REDIRECT_TABS.map(tab => (
          <Link key={tab.label} href={tab.href}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all bg-slate-100 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50">
            <span>{tab.icon}</span>
            {tab.label}
            <span className="text-[10px] opacity-50">&#8599;</span>
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-700/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none">
        {activeTab === 'notebooks' && <NotebookActivity childId={childId} />}
        {activeTab === 'activity' && <ActivityFeed childId={childId} />}
        {activeTab === 'time' && <TimeSpentChart childId={childId} />}
        {activeTab === 'completed' && <CompletedTopics childId={childId} />}
        {activeTab === 'messages' && <TeacherMessages />}
      </div>
    </div>
  );
};
