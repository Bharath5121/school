'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/app.store';

interface ChildInfo {
  id: string;
  name: string;
  email: string;
  gradeLevel: string | null;
  interests: string[];
  linkedAt: string;
}

export default function ParentSettingsPage() {
  const { accessToken } = useAppStore();
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLink, setShowLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ childName: '', childEmail: '' });
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  const fetchChildren = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await fetch('/api/parent/children', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      setChildren(json.data || []);
    } catch {
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { fetchChildren(); }, [fetchChildren]);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError('');
    setLinkLoading(true);
    try {
      const res = await fetch('/api/parent/children/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(linkForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to link');
      setLinkForm({ childName: '', childEmail: '' });
      setShowLink(false);
      fetchChildren();
    } catch (err: any) {
      setLinkError(err.message);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleUnlink = async (childId: string, name: string) => {
    if (!confirm(`Are you sure you want to unlink ${name}? You can re-link them later.`)) return;
    try {
      await fetch(`/api/parent/children/${childId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchChildren();
    } catch {
      /* ignore */
    }
  };

  const inputCls = "flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20";

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">Manage Children</h1>
            <p className="text-xs text-slate-500">Link or unlink student accounts to monitor their learning</p>
          </div>
          <button onClick={() => setShowLink(!showLink)}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/15">
            {showLink ? 'Cancel' : '+ Link Child'}
          </button>
        </div>
      </div>

      {/* Link Form */}
      {showLink && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/40 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Link a New Child</h3>
          <p className="text-xs text-slate-500 mb-4">The student must have an existing account. Enter their exact name and email.</p>
          {linkError && <div className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2">{linkError}</div>}
          <form onSubmit={handleLink} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Child&apos;s Name</label>
              <input type="text" placeholder="Student's full name" value={linkForm.childName}
                onChange={e => setLinkForm({ ...linkForm, childName: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Child&apos;s Email</label>
              <input type="email" placeholder="student@example.com" value={linkForm.childEmail}
                onChange={e => setLinkForm({ ...linkForm, childEmail: e.target.value })} required className={inputCls} />
            </div>
            <button type="submit" disabled={linkLoading}
              className="h-10 px-6 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/15 disabled:opacity-50">
              {linkLoading ? 'Linking...' : 'Link Child'}
            </button>
          </form>
        </div>
      )}

      {/* Children List */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50" />
          ))}
        </div>
      )}

      {!loading && children.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👦</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No children linked</h3>
          <p className="text-sm text-slate-500 mb-4">Click &ldquo;Link Child&rdquo; above to connect a student account.</p>
        </div>
      )}

      {!loading && children.length > 0 && (
        <div className="space-y-3">
          {children.map((child, idx) => {
            const colors = [
              { bg: 'bg-blue-100/60 dark:bg-blue-500/[0.06]', border: 'border-blue-200 dark:border-blue-500/20', accent: 'text-blue-700 dark:text-blue-400' },
              { bg: 'bg-emerald-100/60 dark:bg-emerald-500/[0.06]', border: 'border-emerald-200 dark:border-emerald-500/20', accent: 'text-emerald-700 dark:text-emerald-400' },
              { bg: 'bg-violet-100/60 dark:bg-violet-500/[0.06]', border: 'border-violet-200 dark:border-violet-500/20', accent: 'text-violet-700 dark:text-violet-400' },
            ];
            const c = colors[idx % colors.length];

            return (
              <div key={child.id} className={`p-5 rounded-2xl border ${c.border} ${c.bg} flex items-center gap-4`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black bg-white/60 dark:bg-white/5 ${c.accent}`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{child.name}</h4>
                  <p className="text-[10px] text-slate-500">{child.email}</p>
                  {child.gradeLevel && <p className="text-[10px] text-slate-400 mt-0.5">Field: {child.gradeLevel}</p>}
                  {child.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {child.interests.map(i => (
                        <span key={i} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${c.accent} bg-white/40 dark:bg-white/5`}>
                          {i}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400 mt-1">
                    Linked {new Date(child.linkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => handleUnlink(child.id, child.name)}
                  className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-500 text-[10px] font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                  Unlink
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
