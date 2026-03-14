'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/app.store';

interface Note {
  id: string;
  teacherId: string;
  studentId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ParentMessagesPage() {
  const { accessToken } = useAppStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchNotes = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/parent/notifications?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setNotes(json.data || []);
      setTotal(json.meta?.total || 0);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const markRead = async (noteId: string) => {
    if (!accessToken) return;
    await fetch(`/api/parent/notifications/${noteId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, isRead: true } : n));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 rounded-2xl bg-violet-100/60 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20">
        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">Teacher Messages</h1>
        <p className="text-xs text-slate-500">Notes and alerts from your child&apos;s teachers</p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No messages yet</h3>
          <p className="text-sm text-slate-500">When teachers send notes about your child, they&apos;ll appear here.</p>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.id}
              className={`p-5 rounded-2xl border transition-all ${
                note.isRead
                  ? 'border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/30'
                  : 'border-violet-200 dark:border-violet-500/20 bg-violet-100/60 dark:bg-violet-500/[0.06]'
              }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{note.title}</h4>
                    {!note.isRead && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{note.message}</p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                    })}
                  </span>
                </div>
                {!note.isRead && (
                  <button onClick={() => markRead(note.id)}
                    className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-[10px] font-bold hover:bg-violet-600 transition-all flex-shrink-0">
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}

          {total > 20 && (
            <div className="flex justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-xs font-bold text-slate-500 disabled:opacity-30">
                Previous
              </button>
              <span className="px-4 py-2 text-xs text-slate-400">Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-xs font-bold text-slate-500 disabled:opacity-30">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
