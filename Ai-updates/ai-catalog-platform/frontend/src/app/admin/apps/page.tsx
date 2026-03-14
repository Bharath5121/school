'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  builtBy: '',
  builtByRole: '',
  industrySlug: '',
  whoUsesIt: '',
  tryUrl: '',
  isFree: false,
  careerImpact: '',
  isPublished: true,
};

export default function AppsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(DEFAULT_FORM_DATA);
  const [saving, setSaving] = useState(false);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getApps();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIndustries = useCallback(async () => {
    try {
      const data = await adminApi.getIndustries();
      setIndustries(Array.isArray(data) ? data : []);
    } catch {
      setIndustries([]);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    fetchIndustries();
  }, [fetchApps, fetchIndustries]);

  const industryOptions = industries.map((i) => ({ value: i.slug, label: i.name }));
  const appFields = [
    { key: 'name', label: 'Name', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { key: 'builtBy', label: 'Built By', type: 'text' as const, required: true },
    { key: 'builtByRole', label: 'Built By Role', type: 'text' as const, required: true },
    {
      key: 'industrySlug',
      label: 'Industry',
      type: 'select' as const,
      required: true,
      options: industryOptions,
    },
    { key: 'whoUsesIt', label: 'Who Uses It', type: 'text' as const, required: true },
    { key: 'tryUrl', label: 'Try URL', type: 'url' as const },
    { key: 'isFree', label: 'Free', type: 'boolean' as const },
    { key: 'careerImpact', label: 'Career Impact', type: 'textarea' as const, required: true },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...DEFAULT_FORM_DATA });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({
      name: item.name ?? '',
      description: item.description ?? '',
      builtBy: item.builtBy ?? '',
      builtByRole: item.builtByRole ?? '',
      industrySlug: item.industrySlug ?? '',
      whoUsesIt: item.whoUsesIt ?? '',
      tryUrl: item.tryUrl ?? '',
      isFree: item.isFree ?? false,
      careerImpact: item.careerImpact ?? '',
      isPublished: item.isPublished ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete app "${item.name}"?`)) return;
    try {
      await adminApi.deleteApp(item.id);
      await fetchApps();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        builtBy: formData.builtBy,
        builtByRole: formData.builtByRole,
        industrySlug: formData.industrySlug,
        whoUsesIt: formData.whoUsesIt,
        tryUrl: formData.tryUrl || undefined,
        isFree: !!formData.isFree,
        careerImpact: formData.careerImpact,
        isPublished: !!formData.isPublished,
      };
      if (editing) {
        await adminApi.updateApp(editing.id, payload);
      } else {
        await adminApi.createApp(payload);
      }
      setShowForm(false);
      await fetchApps();
    } catch (err) {
      alert((err as Error).message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      await adminApi.updateApp(id, { sortOrder: newOrder });
      await fetchApps();
    } catch { /* ignore */ }
  };

  const tableFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
    { key: 'isFree', label: 'Free', type: 'boolean' },
    { key: 'isPublished', label: 'Published', type: 'boolean' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="AI Apps"
        searchKey="name"
        filters={tableFilters}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'builtBy', label: 'Built By' },
          { key: 'builtByRole', label: 'Role' },
          {
            key: 'industrySlug',
            label: 'Industry',
            render: (_: unknown, row: any) => (
              <span className="text-slate-600 dark:text-slate-300">
                {row.industry?.name ?? row.industrySlug ?? '—'}
              </span>
            ),
          },
          {
            key: 'isFree',
            label: 'Free',
            render: (v: unknown) => (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                {v ? 'Free' : 'Paid'}
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
        ]}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {showForm && (
        <AdminFormModal
          title={editing ? 'Edit App' : 'Add App'}
          fields={appFields}
          data={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
