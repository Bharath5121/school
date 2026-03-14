'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';
import { ExternalLink } from 'lucide-react';

const INITIAL_FORM = {
  name: '',
  description: '',
  level: 'BEGINNER',
  whyItMatters: '',
  learnUrl: '',
  notebookLmUrl: '',
  timeToLearn: '',
  category: '',
  sortOrder: 0,
  industrySlug: '',
};

export default function SkillsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [skills, ind] = await Promise.all([adminApi.getSkills(), adminApi.getIndustries()]);
      setItems(Array.isArray(skills) ? skills : []);
      setIndustries(Array.isArray(ind) ? ind : []);
    } catch { setItems([]); setIndustries([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => { setEditing(null); setFormData(INITIAL_FORM); setShowForm(true); };
  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({
      name: item.name ?? '', description: item.description ?? '', level: item.level ?? 'BEGINNER',
      whyItMatters: item.whyItMatters ?? '', learnUrl: item.learnUrl ?? '', notebookLmUrl: item.notebookLmUrl ?? '',
      timeToLearn: item.timeToLearn ?? '', category: item.category ?? '', sortOrder: item.sortOrder ?? 0, industrySlug: item.industrySlug ?? '',
    });
    setShowForm(true);
  };
  const handleDelete = async (item: any) => {
    if (!confirm(`Delete skill "${item.name}"?`)) return;
    try { await adminApi.deleteSkill(item.id); await fetchData(); } catch (err) { alert((err as Error).message); }
  };
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name, description: formData.description, level: formData.level,
        whyItMatters: formData.whyItMatters, learnUrl: formData.learnUrl || undefined,
        notebookLmUrl: formData.notebookLmUrl || undefined,
        timeToLearn: formData.timeToLearn, category: formData.category,
        sortOrder: Number(formData.sortOrder) || 0, industrySlug: formData.industrySlug,
      };
      if (editing) { await adminApi.updateSkill(editing.id, payload); }
      else { await adminApi.createSkill(payload); }
      setShowForm(false); await fetchData();
    } catch (err) { alert((err as Error).message); } finally { setSaving(false); }
  };

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      await adminApi.updateSkill(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const industryOptions = industries.map((i: any) => ({ value: i.slug, label: i.name }));
  const tableFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
    { key: 'level', label: 'Level', type: 'select', options: [{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }] },
  ];

  const fields = [
    { key: 'name', label: 'Skill Name', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },
    { key: 'level', label: 'Level', type: 'select' as const, options: [{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }] },
    { key: 'whyItMatters', label: 'Why It Matters', type: 'textarea' as const },
    { key: 'learnUrl', label: 'Learn URL', type: 'url' as const, placeholder: 'Link to learning resource' },
    { key: 'notebookLmUrl', label: 'NotebookLM URL', type: 'url' as const, placeholder: 'Link to NotebookLM resource' },
    { key: 'timeToLearn', label: 'Time to Learn', type: 'text' as const, placeholder: 'e.g. 2 weeks, 1 month' },
    { key: 'category', label: 'Category', type: 'text' as const, placeholder: 'e.g. Technical, Soft Skill' },
    { key: 'sortOrder', label: 'Sort Order', type: 'text' as const },
  ];

  const levelBadge = (v: any) => {
    const styles: Record<string, string> = {
      BEGINNER: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
      INTERMEDIATE: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
      ADVANCED: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[v] || ''}`}>{v}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="Skills"
        searchKey="name"
        filters={tableFilters}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'industrySlug', label: 'Industry', render: (_v: any, row: any) => <span>{row.industry?.name ?? row.industrySlug}</span> },
          { key: 'level', label: 'Level', render: (v: any) => levelBadge(v) },
          { key: 'timeToLearn', label: 'Time', render: (v: any) => <span className="text-xs text-slate-500">{v || '—'}</span> },
          { key: 'learnUrl', label: 'Learn Link', render: (v: any) => v ? (
            <a href={v} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 font-medium">
              Link <ExternalLink size={10} />
            </a>
          ) : <span className="text-xs text-slate-400 italic">Not set</span> },
          { key: 'category', label: 'Category', render: (v: any) => <span className="text-xs text-slate-500">{v || '—'}</span> },
        ]}
        data={items} loading={loading}
        onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}
        onReorder={handleReorder}
      />
      {showForm && (
        <AdminFormModal title={editing ? 'Edit Skill' : 'Add Skill'} fields={fields} data={formData}
          onChange={(k, v) => setFormData(p => ({ ...p, [k]: v }))} onSubmit={handleSubmit} onClose={() => setShowForm(false)} loading={saving} />
      )}
    </div>
  );
}
