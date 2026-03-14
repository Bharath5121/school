'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';
import { SourceUploader } from '@/features/notebooks/components/SourceUploader';
import { CheckCircle2, XCircle } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'MODELS', label: 'Models' },
  { value: 'AGENTS', label: 'Agents' },
  { value: 'APPS', label: 'Apps' },
  { value: 'CLASS', label: 'Class' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Basics', label: 'Basics' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const DEFAULT_FORM = {
  industrySlug: '',
  category: 'CLASS',
  title: '',
  description: '',
  gradeLevel: '',
  difficultyLevel: '',
};

const NOTEBOOK_FIELDS = [
  { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true },
  { key: 'category', label: 'Category', type: 'select' as const, required: true, options: CATEGORY_OPTIONS },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'gradeLevel', label: 'Grade Level', type: 'text' as const, placeholder: 'e.g. 6, 7, 8' },
  { key: 'difficultyLevel', label: 'Difficulty', type: 'select' as const, options: DIFFICULTY_OPTIONS },
];

export default function NotebooksPage() {
  const [items, setItems] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [sourceNotebook, setSourceNotebook] = useState<any | null>(null);

  const fetchNotebooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getNotebooks();
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
    fetchNotebooks();
    fetchIndustries();
  }, [fetchNotebooks, fetchIndustries]);

  const industryOptions = industries.map((i: any) => ({ value: i.slug, label: i.name }));
  const fieldsWithIndustry = NOTEBOOK_FIELDS.map((f) =>
    f.key === 'industrySlug' ? { ...f, options: industryOptions } : f
  );

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...DEFAULT_FORM });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({
      title: item.title ?? '',
      description: item.description ?? '',
      gradeLevel: item.gradeLevel ?? '',
      difficultyLevel: item.difficultyLevel ?? '',
    });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete notebook "${item.title}"? This will also delete the AnythingLLM workspace.`)) return;
    try {
      await adminApi.deleteNotebook(item.id);
      await fetchNotebooks();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateNotebook(editing.id, {
          title: formData.title,
          description: formData.description || undefined,
          gradeLevel: formData.gradeLevel || undefined,
          difficultyLevel: formData.difficultyLevel || undefined,
        });
      } else {
        await adminApi.createNotebook({
          industrySlug: formData.industrySlug,
          category: formData.category,
          title: formData.title,
          description: formData.description || undefined,
          gradeLevel: formData.gradeLevel || undefined,
          difficultyLevel: formData.difficultyLevel || undefined,
        });
      }
      setShowForm(false);
      await fetchNotebooks();
    } catch (err) {
      alert((err as Error).message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (item: any) => {
    try {
      await adminApi.publishNotebook(item.id);
      await fetchNotebooks();
    } catch (err) {
      alert((err as Error).message || 'Failed to publish');
    }
  };

  const notebookFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
    { key: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
    { key: 'published', label: 'Published', type: 'boolean' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="AI Notebooks (AnythingLLM)"
        searchKey="title"
        filters={notebookFilters}
        headerExtra={
          <div className="mb-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              <strong>AnythingLLM Notebooks:</strong> Creating a notebook auto-provisions an AnythingLLM workspace.
              Upload sources (URLs, YouTube, PDFs) to each notebook, then publish to make it available to students.
            </p>
          </div>
        }
        columns={[
          { key: 'title', label: 'Title' },
          {
            key: 'category',
            label: 'Category',
            render: (v: unknown) => (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                {String(v)}
              </span>
            ),
          },
          {
            key: 'gradeLevel',
            label: 'Grade',
            render: (v: unknown) => v ? <span className="text-xs font-medium">{String(v)}</span> : <span className="text-slate-400 text-xs">—</span>,
          },
          {
            key: 'difficultyLevel',
            label: 'Difficulty',
            render: (v: unknown) => v ? <span className="text-xs font-medium">{String(v)}</span> : <span className="text-slate-400 text-xs">—</span>,
          },
          {
            key: 'workspaceCreated',
            label: 'Workspace',
            render: (v: unknown) =>
              v ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-500">
                  <XCircle size={12} /> Pending
                </span>
              ),
          },
          {
            key: 'sourcesCount',
            label: 'Sources',
            render: (v: unknown, row: any) => (
              <button
                onClick={(e) => { e.stopPropagation(); setSourceNotebook(row); }}
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
              >
                {String(v ?? 0)} sources
              </button>
            ),
          },
          {
            key: 'published',
            label: 'Status',
            render: (v: unknown, row: any) =>
              v ? (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">Live</span>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); handlePublish(row); }}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  Publish
                </button>
              ),
          },
        ]}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Source Management Panel */}
      {sourceNotebook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSourceNotebook(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Manage Sources</h3>
            <p className="text-xs text-slate-500 mb-4">{sourceNotebook.title}</p>
            <SourceUploader
              notebookId={sourceNotebook.id}
              sources={sourceNotebook.sources || []}
              onSourceAdded={() => { fetchNotebooks(); setSourceNotebook(null); }}
            />
            <button
              onClick={() => setSourceNotebook(null)}
              className="mt-4 w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <AdminFormModal
          title={editing ? 'Edit Notebook' : 'Create Notebook'}
          fields={editing ? NOTEBOOK_FIELDS.filter(f => !['industrySlug', 'category'].includes(f.key)) : fieldsWithIndustry}
          data={formData}
          onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
