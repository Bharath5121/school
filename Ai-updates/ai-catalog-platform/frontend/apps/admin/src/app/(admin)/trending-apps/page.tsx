'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { trendingApi } from '@/features/trending-apps/services/trending.api';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import type { TrendingCategory, TrendingApp } from '@/features/trending-apps/types';
import type { Industry } from '@/features/discoveries/types';

const DEFAULT_APP = (defaultCatId: string): Partial<TrendingApp> => ({
  slug: '', name: '', tagline: '', description: '', icon: '', logoUrl: '', coverImageUrl: '', provider: '', url: '',
  isFree: false, isAd: false, usage: '', howItHelps: '', sortOrder: 0, isPublished: true, categoryId: defaultCatId, industrySlug: '',
});

export default function TrendingAppsPage() {
  const [categories, setCategories] = useState<TrendingCategory[]>([]);
  const [apps, setApps] = useState<TrendingApp[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAppForm, setShowAppForm] = useState(false);
  const [appFormData, setAppFormData] = useState<Partial<TrendingApp>>(DEFAULT_APP(''));
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState<string>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, appsList, indList] = await Promise.all([
        trendingApi.getCategories(),
        trendingApi.getApps(),
        industriesApi.getAll(),
      ]);
      setCategories(cats);
      setApps(appsList);
      setIndustries(Array.isArray(indList) ? indList : []);
    } catch (err) { console.error('[Trending] Failed to fetch:', err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const defaultCatId = categories[0]?.id || '';

  const openAppForm = (app?: TrendingApp) => {
    if (app) { setEditingAppId(app.id); setAppFormData({ ...app }); }
    else { setEditingAppId(null); setAppFormData(DEFAULT_APP(defaultCatId)); }
    setShowAppForm(true);
  };

  const handleSaveApp = async () => {
    setSaving(true);
    try {
      const payload = { ...appFormData };
      if (!payload.categoryId) payload.categoryId = defaultCatId;
      if (!payload.industrySlug) { alert('Industry is required'); setSaving(false); return; }
      if (editingAppId) await trendingApi.updateApp(editingAppId, payload);
      else await trendingApi.createApp(payload);
      setShowAppForm(false);
      fetchData();
    } catch (e: any) { alert(e?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Delete this app?')) return;
    try { await trendingApi.deleteApp(id); fetchData(); } catch { /* empty */ }
  };

  const industryOptions = industries.map(i => ({ value: i.slug, label: `${i.icon || ''} ${i.name}`.trim() }));

  const appFields = [
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, options: industryOptions, required: true },
    { key: 'name', label: 'Name', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. chatgpt' },
    { key: 'tagline', label: 'Tagline', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' as const, placeholder: 'e.g. 🤖' },
    { key: 'logoUrl', label: 'Logo URL', type: 'text' as const, placeholder: 'https://logo.clearbit.com/openai.com' },
    { key: 'coverImageUrl', label: 'Cover Image URL', type: 'text' as const, placeholder: 'https://example.com/cover.jpg' },
    { key: 'provider', label: 'Provider', type: 'text' as const, placeholder: 'e.g. OpenAI' },
    { key: 'url', label: 'URL', type: 'text' as const, placeholder: 'https://...' },
    { key: 'usage', label: 'Usage (how to use)', type: 'textarea' as const },
    { key: 'howItHelps', label: 'How It Helps', type: 'textarea' as const },
    { key: 'isFree', label: 'Free?', type: 'boolean' as const },
    { key: 'isAd', label: 'Sponsored / Ad?', type: 'boolean' as const },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const filteredApps = filterIndustry === 'all' ? apps : apps.filter(a => a.industrySlug === filterIndustry);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Apps</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage trending apps by industry.</p>
        </div>
        <button onClick={() => openAppForm()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <Plus size={14} /> Add App
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilterIndustry('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterIndustry === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          All ({apps.length})
        </button>
        {industries.map(ind => {
          const count = apps.filter(a => a.industrySlug === ind.slug).length;
          if (count === 0) return null;
          return (
            <button key={ind.slug} onClick={() => setFilterIndustry(ind.slug)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterIndustry === ind.slug ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
              {ind.icon} {ind.name} ({count})
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <p className="text-sm">No apps yet. Add your first app to get started.</p>
        </div>
      )}

      <div className="space-y-2">
        {filteredApps.map(app => (
          <div key={app.id} className="flex items-center justify-between bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700/40 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              {app.logoUrl ? (
                <img src={app.logoUrl} alt={app.name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <span className="text-2xl">{app.icon || '📱'}</span>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{app.name}</span>
                  {app.isFree && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">FREE</span>}
                  {app.isAd && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">AD</span>}
                  {app.industry && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">{app.industry.icon} {app.industry.name}</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500">{app.provider || '—'} &middot; /{app.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {app.url && <a href={app.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400"><ExternalLink size={13} /></a>}
              <button onClick={() => openAppForm(app)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400"><Pencil size={13} /></button>
              <button onClick={() => handleDeleteApp(app.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAppForm && (
        <AdminFormModal
          title={editingAppId ? 'Edit App' : 'New Trending App'}
          fields={appFields}
          data={appFormData}
          onChange={(k, v) => setAppFormData(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleSaveApp}
          onClose={() => setShowAppForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
