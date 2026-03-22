'use client';
import React from 'react';
import { useParentApi } from '../../hooks/useChildData';

interface Note {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const TeacherMessages = () => {
  const { data, loading } = useParentApi<Note[]>('notifications');

  if (loading) return <div className="animate-pulse h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />;

  const notes = data || [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">Teacher Messages</h3>
      {notes.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No messages from teachers yet</p>}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {notes.map(note => (
          <div key={note.id}
            className={`p-3 rounded-xl border ${
              note.isRead
                ? 'border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/30'
                : 'border-violet-200 dark:border-violet-500/20 bg-violet-100/60 dark:bg-violet-500/[0.06]'
            }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-900 dark:text-white">{note.title}</span>
              {!note.isRead && <span className="w-2 h-2 rounded-full bg-violet-500" />}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{note.message}</p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
