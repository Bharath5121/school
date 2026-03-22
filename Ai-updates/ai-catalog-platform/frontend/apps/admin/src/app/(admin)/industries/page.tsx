'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import type { Industry } from '@/features/discoveries/types';

const EMPTY: Partial<Industry> = { name: '', slug: '', description: '', icon: '', color: '#10B981', isActive: true, sortOrder: 0 };

export default function IndustriesPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Industry>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await industriesApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Industries] Failed to fetch:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY, sortOrder: items.length });
    setShowForm(true);
  };

  const openEdit = (item: Industry) => {
    setEditingId(item.id);
    setForm({ name: item.name, slug: item.slug, description: item.description, icon: item.icon, color: item.color, isActive: item.isActive, sortOrder: item.sortOrder });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await industriesApi.update(editingId, form);
      } else {
        await industriesApi.create(form);
      }
      setShowForm(false);
      await fetchData();
    } catch (err) {
      alert((err as Error).message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Industry) => {
    if (!confirm(`Delete industry "${item.name}"? This cannot be undone.`)) return;
    try {
      await industriesApi.delete(item.id);
      await fetchData();
    } catch (err) {
      alert((err as Error).message || 'Delete failed');
    }
  };

  const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const updateField = (key: string, value: unknown) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !editingId) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Industries</h1>
        <button onClick={openNew} className="flex items-center gap-1.5 h-9 px-4 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-slate-500">
          No industries yet. Click &quot;Add New&quot; to create one.
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.03] text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-gray-300 dark:text-slate-600"><GripVertical size={14} /></td>
                  <td className="px-4 py-3 text-lg">{item.icon || '🏭'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400 font-mono text-xs">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-white/10" style={{ backgroundColor: item.color || '#10B981' }} />
                      <span className="text-xs text-gray-400 dark:text-slate-500">{item.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-gray-500 bg-gray-100 dark:bg-white/5'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Industry' : 'New Industry'}
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Name *</label>
                <input
                  value={form.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                  placeholder="e.g. Healthcare & Medicine"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Slug *</label>
                <input
                  value={form.slug || ''}
                  onChange={e => updateField('slug', e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                  placeholder="e.g. healthcare"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={form.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none resize-none"
                  placeholder="Brief description of this industry..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Icon (emoji)</label>
                  <input
                    value={form.icon || ''}
                    onChange={e => updateField('icon', e.target.value)}
                    className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                    placeholder="🏥"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Color (hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color || '#10B981'}
                      onChange={e => updateField('color', e.target.value)}
                      className="w-9 h-9 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer"
                    />
                    <input
                      value={form.color || ''}
                      onChange={e => updateField('color', e.target.value)}
                      className="flex-1 h-9 px-3 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                      placeholder="#10B981"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sortOrder ?? 0}
                    onChange={e => updateField('sortOrder', parseInt(e.target.value) || 0)}
                    className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive ?? true}
                      onChange={e => updateField('isActive', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-slate-300">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="h-9 px-4 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.slug}
                className="h-9 px-5 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
