'use client';

import { MessageCircle, BookOpen } from 'lucide-react';
import { getPalette } from '@/lib/card-palettes';
import type { Notebook } from '../types';

interface NotebookCardProps {
  notebook: Notebook;
  index: number;
  onOpenChat: (notebook: Notebook) => void;
  lastChatDate?: string | null;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Basics: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Intermediate: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Advanced: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
};

export function NotebookCard({ notebook, index, onOpenChat, lastChatDate }: NotebookCardProps) {
  const p = getPalette(index);
  const sources = notebook.sourcesCount || notebook._count?.sources || 0;

  return (
    <div className={`group relative p-5 rounded-2xl border ${p.border} ${p.bg} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden`}>
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: p.glow }} />

      <div className="relative">
        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="text-base">{notebook.industry.icon}</span>
          {notebook.gradeLevel && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tag}`}>
              Grade {notebook.gradeLevel}
            </span>
          )}
          {notebook.difficultyLevel && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[notebook.difficultyLevel] || ''}`}>
              {notebook.difficultyLevel}
            </span>
          )}
          {sources > 0 && (
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 ml-auto">
              {sources} source{sources !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-sm font-bold text-gray-900 dark:text-white ${p.hover} transition-colors mb-1 line-clamp-2`}>
          {notebook.title}
        </h3>

        <p className="text-[11px] text-slate-500 mb-2">{notebook.industry.name}</p>

        {/* Description */}
        {notebook.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{notebook.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <button
            onClick={() => onOpenChat(notebook)}
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg ${p.btn} font-semibold transition-all`}
          >
            <MessageCircle size={13} /> Open Chat
          </button>

          {lastChatDate && (
            <span className="text-[10px] text-slate-400 ml-auto">
              Last chat {new Date(lastChatDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
