'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

interface GuideStep {
  step: number;
  title: string;
  content: string;
}

const EMPTY_STEP: GuideStep = { step: 1, title: '', content: '' };

const GUIDE_FORM = {
  title: '',
  description: '',
  difficulty: 'BEGINNER',
  timeRequired: '',
  toolsNeeded: [] as string[],
  whatYouLearn: '',
  isPublished: true,
  industrySlug: '',
  steps: [] as GuideStep[],
};

const PROMPT_FORM = {
  title: '',
  promptText: '',
  useCase: '',
  category: '',
  industrySlug: '',
};

export default function GuidesAdminPage() {
  const [tab, setTab] = useState<'guides' | 'prompts'>('guides');
  const [guides, setGuides] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showGuideForm, setShowGuideForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any | null>(null);
  const [guideForm, setGuideForm] = useState<Record<string, any>>(GUIDE_FORM);
  const [savingGuide, setSavingGuide] = useState(false);

  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any | null>(null);
  const [promptForm, setPromptForm] = useState<Record<string, any>>(PROMPT_FORM);
  const [savingPrompt, setSavingPrompt] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [g, p, i] = await Promise.all([adminApi.getGuides(), adminApi.getPrompts(), adminApi.getIndustries()]);
      setGuides(Array.isArray(g) ? g : []);
      setPrompts(Array.isArray(p) ? p : []);
      setIndustries(Array.isArray(i) ? i : []);
    } catch { setGuides([]); setPrompts([]); setIndustries([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddGuide = () => { setEditingGuide(null); setGuideForm(GUIDE_FORM); setShowGuideForm(true); };
  const handleEditGuide = (item: any) => {
    setEditingGuide(item);
    const existingSteps = Array.isArray(item.steps) ? item.steps.map((s: any, i: number) => ({
      step: s.step ?? i + 1, title: s.title ?? '', content: s.content ?? '',
    })) : [];
    setGuideForm({
      title: item.title ?? '', description: item.description ?? '', difficulty: item.difficulty ?? 'BEGINNER',
      timeRequired: item.timeRequired ?? '', toolsNeeded: Array.isArray(item.toolsNeeded) ? item.toolsNeeded : [],
      whatYouLearn: item.whatYouLearn ?? '', isPublished: item.isPublished ?? true, industrySlug: item.industrySlug ?? '',
      steps: existingSteps,
    });
    setShowGuideForm(true);
  };
  const handleDeleteGuide = async (item: any) => {
    if (!confirm(`Delete guide "${item.title}"?`)) return;
    try { await adminApi.deleteGuide(item.id); await fetchData(); } catch (err) { alert((err as Error).message); }
  };
  const handleSubmitGuide = async () => {
    setSavingGuide(true);
    try {
      const payload = {
        title: guideForm.title, description: guideForm.description, difficulty: guideForm.difficulty,
        timeRequired: guideForm.timeRequired, toolsNeeded: Array.isArray(guideForm.toolsNeeded) ? guideForm.toolsNeeded : [],
        whatYouLearn: guideForm.whatYouLearn, isPublished: !!guideForm.isPublished, industrySlug: guideForm.industrySlug,
        steps: (guideForm.steps || []).filter((s: GuideStep) => s.title.trim()).map((s: GuideStep, i: number) => ({ step: i + 1, title: s.title, content: s.content })),
      };
      if (editingGuide) { await adminApi.updateGuide(editingGuide.id, payload); }
      else { await adminApi.createGuide(payload); }
      setShowGuideForm(false); await fetchData();
    } catch (err) { alert((err as Error).message); } finally { setSavingGuide(false); }
  };

  const handleAddPrompt = () => { setEditingPrompt(null); setPromptForm(PROMPT_FORM); setShowPromptForm(true); };
  const handleEditPrompt = (item: any) => {
    setEditingPrompt(item);
    setPromptForm({
      title: item.title ?? '', promptText: item.promptText ?? item.prompt ?? '',
      useCase: item.useCase ?? '', category: item.category ?? '', industrySlug: item.industrySlug ?? '',
    });
    setShowPromptForm(true);
  };
  const handleDeletePrompt = async (item: any) => {
    if (!confirm(`Delete prompt "${item.title}"?`)) return;
    try { await adminApi.deletePrompt(item.id); await fetchData(); } catch (err) { alert((err as Error).message); }
  };
  const handleSubmitPrompt = async () => {
    setSavingPrompt(true);
    try {
      const payload = {
        title: promptForm.title, promptText: promptForm.promptText,
        useCase: promptForm.useCase, category: promptForm.category, industrySlug: promptForm.industrySlug,
      };
      if (editingPrompt) { await adminApi.updatePrompt(editingPrompt.id, payload); }
      else { await adminApi.createPrompt(payload); }
      setShowPromptForm(false); await fetchData();
    } catch (err) { alert((err as Error).message); } finally { setSavingPrompt(false); }
  };

  const handleReorderGuide = async (id: string, newOrder: number) => {
    try {
      await adminApi.updateGuide(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const handleReorderPrompt = async (id: string, newOrder: number) => {
    try {
      await adminApi.updatePrompt(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const steps: GuideStep[] = guideForm.steps || [];

  const addStep = () => {
    setGuideForm(p => ({ ...p, steps: [...(p.steps || []), { ...EMPTY_STEP, step: (p.steps || []).length + 1 }] }));
  };
  const removeStep = (idx: number) => {
    setGuideForm(p => ({
      ...p,
      steps: (p.steps as GuideStep[]).filter((_: GuideStep, i: number) => i !== idx).map((s: GuideStep, i: number) => ({ ...s, step: i + 1 })),
    }));
  };
  const updateStep = (idx: number, field: keyof GuideStep, value: string) => {
    setGuideForm(p => ({
      ...p,
      steps: (p.steps as GuideStep[]).map((s: GuideStep, i: number) => i === idx ? { ...s, [field]: value } : s),
    }));
  };
  const moveStep = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    setGuideForm(p => {
      const arr = [...(p.steps as GuideStep[])];
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...p, steps: arr.map((s: GuideStep, i: number) => ({ ...s, step: i + 1 })) };
    });
  };

  const industryOptions = industries.map((i: any) => ({ value: i.slug, label: i.name }));

  const guideFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
    { key: 'difficulty', label: 'Difficulty', type: 'select', options: [{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }] },
    { key: 'isPublished', label: 'Published', type: 'boolean' },
  ];
  const promptFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
  ];

  const guideFields = [
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },
    { key: 'difficulty', label: 'Difficulty', type: 'select' as const, options: [{ value: 'BEGINNER', label: 'Beginner' }, { value: 'INTERMEDIATE', label: 'Intermediate' }, { value: 'ADVANCED', label: 'Advanced' }] },
    { key: 'timeRequired', label: 'Time Required', type: 'text' as const, placeholder: 'e.g. 30 minutes' },
    { key: 'toolsNeeded', label: 'Tools Needed', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'whatYouLearn', label: 'What You Learn', type: 'textarea' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const promptFields = [
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'promptText', label: 'Prompt Text', type: 'textarea' as const, required: true },
    { key: 'useCase', label: 'Use Case', type: 'text' as const },
    { key: 'category', label: 'Category', type: 'text' as const },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },
  ];

  const diffBadge = (v: any) => {
    const styles: Record<string, string> = {
      BEGINNER: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
      INTERMEDIATE: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
      ADVANCED: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10',
    };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[v] || ''}`}>{v}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setTab('guides')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'guides' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
          Guides
        </button>
        <button onClick={() => setTab('prompts')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'prompts' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
          Prompts
        </button>
      </div>

      {tab === 'guides' && (
        <>
          <AdminTable
            title="Guides"
            searchKey="title"
            filters={guideFilters}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'industrySlug', label: 'Industry', render: (_v: any, row: any) => <span>{row.industry?.name ?? row.industrySlug}</span> },
              { key: 'difficulty', label: 'Difficulty', render: (v: any) => diffBadge(v) },
              { key: 'timeRequired', label: 'Time', render: (v: any) => <span className="text-xs text-slate-500">{v || '—'}</span> },
              { key: 'steps', label: 'Steps', render: (v: any) => <span className="text-xs text-slate-500">{Array.isArray(v) ? v.length : 0}</span> },
              { key: 'isPublished', label: 'Status', render: (v: any) => (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'}`}>
                  {v ? 'Live' : 'Draft'}
                </span>
              )},
            ]}
            data={guides} loading={loading}
            onAdd={handleAddGuide} onEdit={handleEditGuide} onDelete={handleDeleteGuide}
            onReorder={handleReorderGuide}
          />
          {showGuideForm && (
            <AdminFormModal title={editingGuide ? 'Edit Guide' : 'Add Guide'} fields={guideFields} data={guideForm}
              onChange={(k, v) => setGuideForm(p => ({ ...p, [k]: v }))} onSubmit={handleSubmitGuide} onClose={() => setShowGuideForm(false)} loading={savingGuide}>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Steps</label>
                  <button type="button" onClick={addStep}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                    <Plus size={14} /> Add Step
                  </button>
                </div>
                {steps.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No steps yet. Click &quot;Add Step&quot; to start building.</p>
                )}
                <div className="space-y-3">
                  {steps.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-6 flex-shrink-0">#{s.step}</span>
                        <input type="text" value={s.title} onChange={e => updateStep(idx, 'title', e.target.value)}
                          placeholder="Step title"
                          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-2 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20" />
                        <button type="button" onClick={() => moveStep(idx, -1)} disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-400 disabled:opacity-30 transition-colors"><ChevronUp size={14} /></button>
                        <button type="button" onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700/50 text-slate-400 disabled:opacity-30 transition-colors"><ChevronDown size={14} /></button>
                        <button type="button" onClick={() => removeStep(idx)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                      <textarea value={s.content} onChange={e => updateStep(idx, 'content', e.target.value)}
                        placeholder="Step content / instructions"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-2 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 min-h-[60px] resize-y" />
                    </div>
                  ))}
                </div>
              </div>
            </AdminFormModal>
          )}
        </>
      )}

      {tab === 'prompts' && (
        <>
          <AdminTable
            title="Prompt Templates"
            searchKey="title"
            filters={promptFilters}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'industrySlug', label: 'Industry', render: (_v: any, row: any) => <span>{row.industry?.name ?? row.industrySlug}</span> },
              { key: 'useCase', label: 'Use Case', render: (v: any) => <span className="text-xs text-slate-500">{v || '—'}</span> },
              { key: 'category', label: 'Category', render: (v: any) => <span className="text-xs text-slate-500">{v || '—'}</span> },
            ]}
            data={prompts} loading={loading}
            onAdd={handleAddPrompt} onEdit={handleEditPrompt} onDelete={handleDeletePrompt}
            onReorder={handleReorderPrompt}
          />
          {showPromptForm && (
            <AdminFormModal title={editingPrompt ? 'Edit Prompt' : 'Add Prompt'} fields={promptFields} data={promptForm}
              onChange={(k, v) => setPromptForm(p => ({ ...p, [k]: v }))} onSubmit={handleSubmitPrompt} onClose={() => setShowPromptForm(false)} loading={savingPrompt} />
          )}
        </>
      )}
    </div>
  );
}
