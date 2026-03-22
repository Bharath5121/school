'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, Cpu, AppWindow } from 'lucide-react';
import { labApi } from '@/features/lab/services/lab.api';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import type { LabCategory, LabItem } from '@/features/lab/types';

const DEFAULT_CAT: Partial<LabCategory> = { slug: '', title: '', description: '', icon: '', sortOrder: 0, isPublished: true };
const DEFAULT_ITEM = (catId: string): Partial<LabItem> => ({ slug: '', title: '', tagline: '', description: '', icon: '', provider: '', type: 'MODEL', useCases: [], features: [], sortOrder: 0, isPublished: true, categoryId: catId });

export default function LabPage() {
  const [categories, setCategories] = useState<LabCategory[]>([]);
  const [items, setItems] = useState<LabItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCatForm, setShowCatForm] = useState(false);
  const [catFormData, setCatFormData] = useState<Partial<LabCategory>>(DEFAULT_CAT);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [showItemForm, setShowItemForm] = useState(false);
  const [itemFormData, setItemFormData] = useState<Partial<LabItem>>(DEFAULT_ITEM(''));
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, its] = await Promise.all([labApi.getCategories(), labApi.getItems()]);
      setCategories(cats);
      setItems(its);
    } catch (err) { console.error('[Lab] Failed to fetch data:', err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCatForm = (cat?: LabCategory) => {
    if (cat) {
      setEditingCatId(cat.id);
      setCatFormData({ ...cat });
    } else {
      setEditingCatId(null);
      setCatFormData({ ...DEFAULT_CAT });
    }
    setShowCatForm(true);
  };

  const openItemForm = (item?: LabItem, presetCatId?: string) => {
    if (item) {
      setEditingItemId(item.id);
      setItemFormData({ ...item });
    } else {
      setEditingItemId(null);
      setItemFormData(DEFAULT_ITEM(presetCatId || categories[0]?.id || ''));
    }
    setShowItemForm(true);
  };

  const handleSaveCat = async () => {
    setSaving(true);
    try {
      if (editingCatId) await labApi.updateCategory(editingCatId, catFormData);
      else await labApi.createCategory(catFormData);
      setShowCatForm(false);
      fetchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      if (editingItemId) await labApi.updateItem(editingItemId, itemFormData);
      else await labApi.createItem(itemFormData);
      setShowItemForm(false);
      fetchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDeleteCat = async (id: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    try { await labApi.deleteCategory(id); fetchData(); } catch { /* empty */ }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try { await labApi.deleteItem(id); fetchData(); } catch { /* empty */ }
  };

  const catFields = [
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. text-to-image' },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' as const, placeholder: 'e.g. 🎨' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const catOptions = categories.map(c => ({ value: c.id, label: c.title }));
  const itemFields = [
    { key: 'categoryId', label: 'Category', type: 'select' as const, options: catOptions, required: true },
    { key: 'type', label: 'Type', type: 'select' as const, options: [{ value: 'MODEL', label: 'Model' }, { value: 'APP', label: 'App' }], required: true },
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. chatgpt' },
    { key: 'tagline', label: 'Tagline', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'icon', label: 'Icon (emoji)', type: 'text' as const, placeholder: 'e.g. 🤖' },
    { key: 'provider', label: 'Provider', type: 'text' as const, placeholder: 'e.g. OpenAI' },
    { key: 'useCases', label: 'Use Cases', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'features', label: 'Features', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Lab</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage categories (panels) and models/apps within them.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openCatForm()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
            <Plus size={14} /> Category
          </button>
          <button onClick={() => openItemForm()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus size={14} /> Model / App
          </button>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <p className="text-sm">No categories yet. Create your first category to get started.</p>
        </div>
      )}

      {categories.map(cat => {
        const catItems = items.filter(i => i.categoryId === cat.id);
        const isExpanded = expandedCat === cat.id;
        return (
          <div key={cat.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700/40 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors" onClick={() => setExpandedCat(isExpanded ? null : cat.id)}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon || '📁'}</span>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{cat.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{catItems.length} items &middot; /{cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); openItemForm(undefined, cat.id); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"><Plus size={12} /> Add Item</button>
                <button onClick={(e) => { e.stopPropagation(); openCatForm(cat); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><Pencil size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteCat(cat.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 dark:border-slate-700/40 px-5 py-4 space-y-2">
                {catItems.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">No items in this category yet.</p>}
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0B0F19] rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon || '📦'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.type === 'MODEL' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'}`}>
                            {item.type === 'MODEL' ? <><Cpu size={10} className="inline mr-0.5" />Model</> : <><AppWindow size={10} className="inline mr-0.5" />App</>}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500">{item.provider || '—'} &middot; /{item.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openItemForm(item)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400"><Pencil size={13} /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {showCatForm && (
        <AdminFormModal
          title={editingCatId ? 'Edit Category' : 'New Category'}
          fields={catFields}
          data={catFormData}
          onChange={(k, v) => setCatFormData(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleSaveCat}
          onClose={() => setShowCatForm(false)}
          loading={saving}
        />
      )}

      {showItemForm && (
        <AdminFormModal
          title={editingItemId ? 'Edit Model/App' : 'New Model/App'}
          fields={itemFields}
          data={itemFormData}
          onChange={(k, v) => setItemFormData(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleSaveItem}
          onClose={() => setShowItemForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
