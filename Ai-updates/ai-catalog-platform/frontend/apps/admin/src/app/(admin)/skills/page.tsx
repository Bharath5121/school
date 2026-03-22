'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Zap } from 'lucide-react';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import { skillsApi } from '@/features/skills/services/skills.api';
import type { Industry } from '@/features/discoveries/types';
import type { Skill } from '@/features/skills/types';

const DEFAULT_SKILL: Partial<Skill> = {
  name: '',
  description: '',
  industrySlug: '',
  level: 'BEGINNER',
  whyItMatters: '',
  learnUrl: '',
  notebookLmUrl: '',
  timeToLearn: '',
  category: '',
  sortOrder: 0,
};

const LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  INTERMEDIATE: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  ADVANCED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({ ...DEFAULT_SKILL });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [skillList, indList] = await Promise.all([
        skillsApi.getSkills(),
        industriesApi.getAll(),
      ]);
      setSkills(skillList);
      setIndustries(Array.isArray(indList) ? indList : []);
    } catch (err) {
      console.error('[Skills] Failed to fetch:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({ ...DEFAULT_SKILL });
    setShowForm(true);
  };

  const openEditForm = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({ ...skill, learnUrl: skill.learnUrl || '', notebookLmUrl: skill.notebookLmUrl || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...formData };
      if (editingId) await skillsApi.updateSkill(editingId, payload);
      else await skillsApi.createSkill(payload);
      setShowForm(false);
      fetchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    try { await skillsApi.deleteSkill(id); fetchData(); } catch { /* no-op */ }
  };

  const industryOptions = industries.map((i) => ({ value: i.slug, label: `${i.icon || ''} ${i.name}`.trim() }));
  const filtered = filter === 'all' ? skills : skills.filter((s) => s.industrySlug === filter);

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || 'Uncategorized';
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  const fields = [
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, options: industryOptions, required: true },
    { key: 'name', label: 'Skill Name', type: 'text' as const, required: true, placeholder: 'e.g. Natural Language Processing' },
    { key: 'category', label: 'Category', type: 'text' as const, required: true, placeholder: 'e.g. AI Fundamentals, Data Analysis' },
    { key: 'level', label: 'Level', type: 'select' as const, options: LEVEL_OPTIONS, required: true },
    { key: 'timeToLearn', label: 'Time to Learn', type: 'text' as const, required: true, placeholder: 'e.g. 2 weeks' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { key: 'whyItMatters', label: 'Why It Matters', type: 'textarea' as const, required: true },
    { key: 'learnUrl', label: 'Learn URL', type: 'text' as const, placeholder: 'https://...' },
    { key: 'notebookLmUrl', label: 'Notebook LM URL', type: 'text' as const, placeholder: 'https://...' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage AI & future skills students need to master.</p>
        </div>
        <button onClick={openCreateForm} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {/* Industry filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          All ({skills.length})
        </button>
        {industries.map((ind) => {
          const cnt = skills.filter((s) => s.industrySlug === ind.slug).length;
          if (cnt === 0) return null;
          return (
            <button key={ind.slug} onClick={() => setFilter(ind.slug)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === ind.slug ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
              {ind.icon} {ind.name} ({cnt})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <Zap size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No skills yet. Create your first skill to get started.</p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((skill) => (
              <div key={skill.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700/40 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{skill.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${LEVEL_COLORS[skill.level] || ''}`}>
                        {skill.level}
                      </span>
                    </div>
                    {skill.industry && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                        {skill.industry.icon} {skill.industry.name}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{skill.timeToLearn}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => openEditForm(skill)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mt-3">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showForm && (
        <AdminFormModal
          title={editingId ? 'Edit Skill' : 'New Skill'}
          fields={fields}
          data={formData}
          onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
          onSubmit={handleSave}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
