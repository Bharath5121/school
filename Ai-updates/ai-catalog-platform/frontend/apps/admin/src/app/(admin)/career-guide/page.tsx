'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import { careerGuideApi } from '@/features/career-guide/services/career-guide.api';
import type { Industry } from '@/features/discoveries/types';
import type { CareerGuide } from '@/features/career-guide/types';

const DEFAULT_GUIDE: Partial<CareerGuide> = {
  title: '',
  description: '',
  difficulty: 'BEGINNER',
  timeRequired: '',
  toolsNeeded: [],
  industrySlug: '',
  whatYouLearn: '',
  steps: [],
  sortOrder: 0,
  isPublished: true,
};

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

function formatSteps(steps: unknown): string {
  if (!steps) return '';
  if (Array.isArray(steps)) return steps.map((s) => (typeof s === 'string' ? s : JSON.stringify(s))).join('\n');
  if (typeof steps === 'string') return steps;
  return JSON.stringify(steps, null, 2);
}

export default function CareerGuidePage() {
  const [guides, setGuides] = useState<CareerGuide[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CareerGuide> & { toolsNeededText?: string; stepsText?: string }>({
    ...DEFAULT_GUIDE,
    toolsNeededText: '',
    stepsText: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [guideList, indList] = await Promise.all([
        careerGuideApi.getGuides(),
        industriesApi.getAll(),
      ]);
      setGuides(guideList);
      setIndustries(Array.isArray(indList) ? indList : []);
    } catch (err) {
      console.error('[CareerGuide] Failed to fetch:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreateForm = () => {
    setEditingGuideId(null);
    setFormData({ ...DEFAULT_GUIDE, toolsNeededText: '', stepsText: '' });
    setShowForm(true);
  };

  const openEditForm = (guide: CareerGuide) => {
    setEditingGuideId(guide.id);
    setFormData({
      ...guide,
      toolsNeededText: guide.toolsNeeded.join(', '),
      stepsText: formatSteps(guide.steps),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Partial<CareerGuide> = {
        ...formData,
        toolsNeeded: (formData.toolsNeededText || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        steps: (formData.stepsText || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      delete (payload as any).toolsNeededText;
      delete (payload as any).stepsText;

      if (editingGuideId) await careerGuideApi.updateGuide(editingGuideId, payload);
      else await careerGuideApi.createGuide(payload);

      setShowForm(false);
      fetchData();
    } catch (e: any) {
      alert(e?.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this career guide?')) return;
    try {
      await careerGuideApi.deleteGuide(id);
      fetchData();
    } catch {
      // no-op
    }
  };

  const industryOptions = industries.map((i) => ({ value: i.slug, label: `${i.icon || ''} ${i.name}`.trim() }));
  const fields = [
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, options: industryOptions, required: true },
    { key: 'title', label: 'Guide Title', type: 'text' as const, required: true, placeholder: 'e.g. Build an AI-powered symptom checker' },
    { key: 'difficulty', label: 'Difficulty', type: 'select' as const, options: DIFFICULTY_OPTIONS, required: true },
    { key: 'timeRequired', label: 'Time Required', type: 'text' as const, required: true, placeholder: 'e.g. 30 mins' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { key: 'whatYouLearn', label: "What You'll Learn", type: 'textarea' as const, required: true },
    { key: 'toolsNeededText', label: 'Tools Needed (comma-separated)', type: 'text' as const, placeholder: 'Python, OpenAI API, Flask' },
    { key: 'stepsText', label: 'Steps (one step per line)', type: 'textarea' as const, placeholder: 'Step 1: ...\nStep 2: ...' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Career Guide</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create practical AI career learning guides for students.</p>
        </div>
        <button onClick={openCreateForm} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
          <Plus size={14} /> Add Guide
        </button>
      </div>

      {guides.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <p className="text-sm">No guides yet. Create your first guide to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <div key={guide.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700/40 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{guide.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {guide.difficulty}
                  </span>
                  {guide.industry && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
                      {guide.industry.icon} {guide.industry.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500">{guide.timeRequired}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEditForm(guide)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(guide.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2 mt-3">{guide.description}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <AdminFormModal
          title={editingGuideId ? 'Edit Career Guide' : 'New Career Guide'}
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
