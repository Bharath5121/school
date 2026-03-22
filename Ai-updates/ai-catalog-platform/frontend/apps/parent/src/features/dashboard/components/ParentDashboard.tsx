'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { useDashboard } from '../../hooks/useDashboard';
import { ChildCard } from './ChildCard';

interface ChildStats {
  skillsLearned: number;
  skillsTotal: number;
  careersExplored: number;
  minutesThisWeek: number;
  itemsReadThisWeek: number;
  notebooksThisWeek: number;
}

interface ChildInfo {
  id: string;
  name: string;
  email: string;
  gradeLevel: string | null;
  avatarUrl: string | null;
  interests: string[];
  stats: ChildStats;
}

interface ParentData {
  parent: { name: string };
  children: ChildInfo[];
  unreadMessages: number;
}

interface LinkChildModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LinkChildModal = ({ open, onClose, onSuccess }: LinkChildModalProps) => {
  const [form, setForm] = useState({ childName: '', childEmail: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAppStore();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/parent/children/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to link child');
      setForm({ childName: '', childEmail: '' });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Link a Child</h3>
        <p className="text-xs text-slate-500 mb-4">Enter your child&apos;s name and email. They must have an existing student account.</p>
        {error && <div className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Child&apos;s Name</label>
            <input type="text" placeholder="Student's full name" value={form.childName}
              onChange={e => setForm({ ...form, childName: e.target.value })} required className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Child&apos;s Email</label>
            <input type="email" placeholder="student@example.com" value={form.childEmail}
              onChange={e => setForm({ ...form, childEmail: e.target.value })} required className={inputCls} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-slate-200 dark:border-slate-700/40 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-10 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-all shadow-md shadow-blue-500/15 disabled:opacity-50">
              {loading ? 'Linking...' : 'Link Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ParentDashboard = () => {
  const { user: authUser } = useAppStore();
  const { data, loading, error, refetch } = useDashboard<ParentData>('parent');
  const [showLinkModal, setShowLinkModal] = useState(false);

  if (loading) return <div className="text-slate-400 animate-pulse font-heading text-xl">Loading dashboard...</div>;
  if (error) return <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500">Failed to load data.</div>;
  if (!data) return null;

  const displayName = authUser?.name || data.parent.name;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Banner */}
      <section className="p-8 rounded-2xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Welcome, {displayName}</h1>
            <p className="text-sm text-slate-500">Parent Dashboard &mdash; monitor your children&apos;s learning journey</p>
          </div>
          <div className="flex items-center gap-3">
            {data.unreadMessages > 0 && (
              <Link href="/parent/messages"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-100/60 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20 hover:shadow-md transition-all">
                <span>💬</span>
                <span className="text-xs font-bold text-violet-700 dark:text-violet-400">{data.unreadMessages} new</span>
              </Link>
            )}
            <button onClick={() => setShowLinkModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/15">
              + Link Child
            </button>
          </div>
        </div>
      </section>

      {/* Children */}
      {data.children.length > 0 ? (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
            My Children ({data.children.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.children.map((child, idx) => (
              <ChildCard key={child.id} child={child} index={idx} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-16">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No children linked yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Link your child&apos;s student account to see their learning progress, activity, and more.
          </p>
          <button onClick={() => setShowLinkModal(true)}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/15">
            Link Your First Child
          </button>
        </section>
      )}

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/parent/messages"
          className="p-5 rounded-2xl bg-violet-100/60 dark:bg-violet-500/[0.06] border border-violet-200 dark:border-violet-500/20 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">💬</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">Messages</span>
          </div>
          <p className="text-xs text-slate-500">View teacher notes and alerts</p>
        </Link>
        <Link href="/parent/settings"
          className="p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">👦</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Manage Children</span>
          </div>
          <p className="text-xs text-slate-500">Link or unlink student accounts</p>
        </Link>
        <Link href="/settings"
          className="p-5 rounded-2xl bg-amber-100/60 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/20 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">⚙️</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">Settings</span>
          </div>
          <p className="text-xs text-slate-500">Account and notification preferences</p>
        </Link>
      </section>

      <LinkChildModal open={showLinkModal} onClose={() => setShowLinkModal(false)} onSuccess={() => refetch()} />
    </div>
  );
};
