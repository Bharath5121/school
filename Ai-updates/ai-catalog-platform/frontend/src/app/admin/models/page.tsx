'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

const INITIAL_FORM: Record<string, any> = {
  name: '',
  description: '',
  builtBy: '',
  builtByRole: '',
  industrySlug: '',
  difficultyLevel: 'Beginner',
  gradeLevel: [] as string[],
  modelType: '',
  releaseYear: '',
  parameters: '',
  inputType: [] as string[],
  outputType: [] as string[],
  whatItDoes: '',
  whatItAutomates: '',
  skillsNeeded: [] as string[],
  useCaseTags: [] as string[],
  careerImpact: '',
  whatToLearnFirst: '',
  realWorldExample: '',
  isFree: false,
  tryUrl: '',
  notebookLmUrl: '',
  youtubeUrl: '',
  udemyUrl: '',
  sourceUrl: '',
  huggingFaceUrl: '',
  whatToLearn: [] as string[],
  tags: [] as string[],
  isPublished: true,
};

const MODEL_TYPE_OPTIONS = [
  { value: 'LLM', label: 'LLM' },
  { value: 'Vision', label: 'Vision' },
  { value: 'NLP', label: 'NLP' },
  { value: 'Multimodal', label: 'Multimodal' },
  { value: 'Audio', label: 'Audio' },
  { value: 'Other', label: 'Other' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export default function ModelsPage() {
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
      const [modelsData, industriesData] = await Promise.all([
        adminApi.getModels(),
        adminApi.getIndustries(),
      ]);
      setItems(Array.isArray(modelsData) ? modelsData : []);
      setIndustries(Array.isArray(industriesData) ? industriesData : []);
    } catch {
      setItems([]);
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...INITIAL_FORM });
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
      difficultyLevel: item.difficultyLevel ?? 'Beginner',
      gradeLevel: Array.isArray(item.gradeLevel) ? item.gradeLevel : [],
      modelType: item.modelType ?? '',
      releaseYear: item.releaseYear ?? '',
      parameters: item.parameters ?? '',
      inputType: Array.isArray(item.inputType) ? item.inputType : [],
      outputType: Array.isArray(item.outputType) ? item.outputType : [],
      whatItDoes: item.whatItDoes ?? '',
      whatItAutomates: item.whatItAutomates ?? '',
      skillsNeeded: Array.isArray(item.skillsNeeded) ? item.skillsNeeded : [],
      useCaseTags: Array.isArray(item.useCaseTags) ? item.useCaseTags : [],
      careerImpact: item.careerImpact ?? '',
      whatToLearnFirst: item.whatToLearnFirst ?? '',
      realWorldExample: item.realWorldExample ?? '',
      isFree: item.isFree ?? false,
      tryUrl: item.tryUrl ?? '',
      notebookLmUrl: item.notebookLmUrl ?? '',
      youtubeUrl: item.youtubeUrl ?? '',
      udemyUrl: item.udemyUrl ?? '',
      sourceUrl: item.sourceUrl ?? '',
      huggingFaceUrl: item.huggingFaceUrl ?? '',
      whatToLearn: Array.isArray(item.whatToLearn) ? item.whatToLearn : [],
      tags: Array.isArray(item.tags) ? item.tags : [],
      isPublished: item.isPublished ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete model "${item.name}"?`)) return;
    try {
      await adminApi.deleteModel(item.id);
      await fetchData();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: formData.name,
        description: formData.description,
        builtBy: formData.builtBy,
        builtByRole: formData.builtByRole,
        industrySlug: formData.industrySlug,
        difficultyLevel: formData.difficultyLevel,
        gradeLevel: formData.gradeLevel,
        modelType: formData.modelType,
        releaseYear: formData.releaseYear,
        parameters: formData.parameters,
        inputType: formData.inputType,
        outputType: formData.outputType,
        whatItDoes: formData.whatItDoes,
        whatItAutomates: formData.whatItAutomates,
        skillsNeeded: formData.skillsNeeded,
        useCaseTags: formData.useCaseTags,
        careerImpact: formData.careerImpact,
        whatToLearnFirst: formData.whatToLearnFirst,
        realWorldExample: formData.realWorldExample,
        isFree: !!formData.isFree,
        tryUrl: formData.tryUrl || undefined,
        notebookLmUrl: formData.notebookLmUrl || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
        udemyUrl: formData.udemyUrl || undefined,
        sourceUrl: formData.sourceUrl || undefined,
        huggingFaceUrl: formData.huggingFaceUrl || undefined,
        whatToLearn: formData.whatToLearn,
        tags: formData.tags,
        isPublished: !!formData.isPublished,
      };
      if (editing) {
        await adminApi.updateModel(editing.id, payload);
      } else {
        await adminApi.createModel(payload);
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
      await adminApi.updateModel(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const industryOptions = industries.map((i) => ({ value: i.slug, label: i.name }));

  const modelFields = [
    { key: '_section_basic', label: '── Basic Info ──', type: 'section' as const },
    { key: 'name', label: 'Name', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { key: 'builtBy', label: 'Built By', type: 'text' as const, required: true },
    { key: 'builtByRole', label: 'Built By Role', type: 'text' as const },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },

    { key: '_section_class', label: '── Classification ──', type: 'section' as const },
    { key: 'modelType', label: 'Model Type', type: 'select' as const, options: MODEL_TYPE_OPTIONS },
    { key: 'difficultyLevel', label: 'Difficulty Level', type: 'select' as const, options: DIFFICULTY_OPTIONS },
    { key: 'gradeLevel', label: 'Grade Level', type: 'tags' as const, placeholder: '6, 7, 8, 9, 10, 11, 12' },
    { key: 'releaseYear', label: 'Release Year', type: 'text' as const, placeholder: 'e.g. 2024' },
    { key: 'parameters', label: 'Parameters', type: 'text' as const, placeholder: 'e.g. 7B, 70B, Unknown' },

    { key: '_section_caps', label: '── Capabilities ──', type: 'section' as const },
    { key: 'whatItDoes', label: 'What It Does', type: 'textarea' as const },
    { key: 'whatItAutomates', label: 'What It Automates', type: 'textarea' as const },
    { key: 'inputType', label: 'Input Type', type: 'tags' as const, placeholder: 'Text, Image, Audio, Video, Code' },
    { key: 'outputType', label: 'Output Type', type: 'tags' as const, placeholder: 'Text, Image, Audio, Code' },

    { key: '_section_learn', label: '── Learning ──', type: 'section' as const },
    { key: 'skillsNeeded', label: 'Skills Needed', type: 'tags' as const },
    { key: 'useCaseTags', label: 'Use Case Tags', type: 'tags' as const, placeholder: 'e.g. Drug Discovery, Diagnosis' },
    { key: 'careerImpact', label: 'Career Impact', type: 'textarea' as const, required: true },
    { key: 'whatToLearnFirst', label: 'What To Learn First', type: 'textarea' as const, placeholder: 'Prerequisites' },
    { key: 'realWorldExample', label: 'Real World Example', type: 'text' as const, placeholder: 'One line concrete example' },
    { key: 'whatToLearn', label: 'What to Learn (Legacy)', type: 'tags' as const },
    { key: 'tags', label: 'Tags', type: 'tags' as const },

    { key: '_section_links', label: '── Links ──', type: 'section' as const },
    { key: 'tryUrl', label: 'Try URL', type: 'url' as const },
    { key: 'youtubeUrl', label: 'YouTube URL', type: 'url' as const },
    { key: 'udemyUrl', label: 'Udemy URL', type: 'url' as const },
    { key: 'sourceUrl', label: 'Source URL', type: 'url' as const },
    { key: 'notebookLmUrl', label: 'NotebookLM URL', type: 'url' as const },
    { key: 'huggingFaceUrl', label: 'Hugging Face URL', type: 'url' as const },

    { key: '_section_toggles', label: '── Settings ──', type: 'section' as const },
    { key: 'isFree', label: 'Free', type: 'boolean' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const tableFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
    { key: 'isFree', label: 'Free', type: 'boolean' },
    { key: 'isPublished', label: 'Published', type: 'boolean' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="AI Models"
        searchKey="name"
        filters={tableFilters}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'builtBy', label: 'Built By' },
          { key: 'modelType', label: 'Type' },
          { key: 'difficultyLevel', label: 'Difficulty' },
          {
            key: 'industrySlug',
            label: 'Industry',
            render: (_v: any, row: any) => (
              <span className="text-slate-600 dark:text-slate-300">
                {row.industry?.name ?? row.industrySlug ?? '—'}
              </span>
            ),
          },
          {
            key: 'isFree',
            label: 'Free',
            render: (v: any) => (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                {v ? 'Free' : 'Paid'}
              </span>
            ),
          },
          {
            key: 'isPublished',
            label: 'Status',
            render: (v: any) => (
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
          title={editing ? 'Edit Model' : 'Add Model'}
          fields={modelFields}
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
