'use client';

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { NotebookCard } from './NotebookCard';
import { ChatDrawer } from './ChatDrawer';
import type { Notebook } from '../types';

interface NotebookGridProps {
  notebooks: Notebook[];
}

const DIFFICULTY_TABS = ['All', 'Basics', 'Intermediate', 'Advanced'] as const;

export function NotebookGrid({ notebooks }: NotebookGridProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [chatNotebook, setChatNotebook] = useState<Notebook | null>(null);

  const filtered = activeFilter === 'All'
    ? notebooks
    : notebooks.filter(n => n.difficultyLevel === activeFilter);

  const grouped = filtered.reduce<Record<string, Notebook[]>>((acc, nb) => {
    const key = nb.gradeLevel ? `Grade ${nb.gradeLevel}` : 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(nb);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

  if (notebooks.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen size={40} className="mx-auto mb-3 text-slate-400" />
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">No notebooks yet</p>
        <p className="text-sm text-slate-500">Notebooks will appear here once published by admin.</p>
      </div>
    );
  }

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {DIFFICULTY_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              activeFilter === tab
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/40 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grouped Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No notebooks match this filter.
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroups.map(([group, nbs]) => (
            <div key={group}>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                {group}
                {nbs[0]?.difficultyLevel && (
                  <span className="text-slate-400 dark:text-slate-500 font-medium ml-2 normal-case tracking-normal">
                    — {nbs[0].difficultyLevel}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nbs.map((nb, idx) => (
                  <NotebookCard
                    key={nb.id}
                    notebook={nb}
                    index={idx}
                    onOpenChat={setChatNotebook}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Drawer */}
      {chatNotebook && (
        <ChatDrawer notebook={chatNotebook} onClose={() => setChatNotebook(null)} />
      )}
    </>
  );
}
