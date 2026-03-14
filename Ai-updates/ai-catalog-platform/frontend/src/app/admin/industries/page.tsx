'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

const INDUSTRY_FIELDS = [
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'slug', label: 'Slug', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
  { key: 'icon', label: 'Icon', type: 'text' as const },
  { key: 'color', label: 'Color', type: 'text' as const },
  { key: 'gradient', label: 'Gradient', type: 'text' as const },
  { key: 'isActive', label: 'Active', type: 'boolean' as const },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
];

const INITIAL_FORM = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '',
  gradient: '',
  isActive: true,
  sortOrder: 0,
};

export default function IndustriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getIndustries();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditing(null);
    setFormData(INITIAL_FORM);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({
      name: item.name ?? '',
      slug: item.slug ?? '',
      description: item.description ?? '',
      icon: item.icon ?? '',
      color: item.color ?? '',
      gradient: item.gradient ?? '',
      isActive: item.isActive ?? true,
      sortOrder: item.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete industry "${item.name}"?`)) return;
    try {
      await adminApi.deleteIndustry(item.id);
      await fetchData();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        icon: formData.icon || undefined,
        color: formData.color || undefined,
        gradient: formData.gradient || undefined,
        isActive: !!formData.isActive,
        sortOrder: Number(formData.sortOrder) || 0,
      };
      if (editing) {
        await adminApi.updateIndustry(editing.id, payload);
      } else {
        await adminApi.createIndustry(payload);
      }
      setShowForm(false);
      await fetchData();
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
      await adminApi.updateIndustry(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="Industries"
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'icon', label: 'Icon' },
          { key: 'color', label: 'Color' },
          {
            key: 'isActive',
            label: 'Active',
            render: (v) => (
              <span className={v ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-500'}>
                {v ? 'Yes' : 'No'}
              </span>
            ),
          },
          { key: 'sortOrder', label: 'Sort Order' },
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
          title={editing ? 'Edit Industry' : 'Add Industry'}
          fields={INDUSTRY_FIELDS}
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
