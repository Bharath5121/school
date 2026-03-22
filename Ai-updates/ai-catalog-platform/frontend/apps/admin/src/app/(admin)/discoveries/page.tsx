'use client';

import { useEffect, useState, useCallback } from 'react';
import { discoveriesApi } from '@/features/discoveries/services/discoveries.api';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import { AdminTable } from '@/components/shared/AdminTable';
import { DiscoveryFormDialog } from '@/features/discoveries/components/DiscoveryFormDialog';
import type { Discovery, Industry } from '@/features/discoveries/types';

export default function DiscoveriesPage() {
  const [items, setItems] = useState<Discovery[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Discovery | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [discData, indData] = await Promise.all([
        discoveriesApi.getAll(),
        industriesApi.getAll(),
      ]);
      setItems(Array.isArray(discData) ? discData : []);
      setIndustries(Array.isArray(indData) ? indData : []);
    } catch (err) {
      console.error('[Discoveries] Failed to fetch data:', err);
      setItems([]);
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (item: Discovery) => { setEditing(item); setShowForm(true); };

  const handleDelete = async (item: Discovery) => {
    if (!confirm(`Delete discovery "${item.title}"?`)) return;
    try {
      await discoveriesApi.delete(item.id);
      await fetchData();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      await discoveriesApi.update(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const industryOptions = industries.map(i => ({ value: i.slug, label: i.name }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="Discoveries"
        searchKey="title"
        filters={[
          { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
          { key: 'isPublished', label: 'Published', type: 'boolean' },
          { key: 'isFeatured', label: 'Featured', type: 'boolean' },
        ]}
        columns={[
          { key: 'title', label: 'Title' },
          {
            key: 'industrySlug',
            label: 'Industry',
            render: (_v: unknown, row: Discovery) => (
              <span className="text-slate-600 dark:text-slate-300">
                {row.industry?.name ?? row.industrySlug ?? '—'}
              </span>
            ),
          },
          { key: 'difficulty', label: 'Level' },
          {
            key: 'isFeatured',
            label: 'Featured',
            render: (v: unknown) => (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                {v ? 'Featured' : '—'}
              </span>
            ),
          },
          {
            key: 'isPublished',
            label: 'Status',
            render: (v: unknown) => (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'}`}>
                {v ? 'Live' : 'Draft'}
              </span>
            ),
          },
          { key: 'xp', label: 'XP' },
        ]}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {showForm && (
        <DiscoveryFormDialog
          editing={editing}
          industryOptions={industryOptions}
          onClose={() => setShowForm(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
