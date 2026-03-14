'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

const CATEGORY_OPTIONS = [
  { value: 'models', label: 'Models' },
  { value: 'career', label: 'Career' },
  { value: 'learning', label: 'Learning' },
  { value: 'tools', label: 'Tools' },
  { value: 'future', label: 'Future' },
];

const DEFAULT_FORM_DATA = {
  question: '',
  industrySlug: '',
  category: '',
  sortOrder: 0,
  isActive: true,
};

export default function QuestionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(DEFAULT_FORM_DATA);
  const [saving, setSaving] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getQuestions();
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
    fetchQuestions();
    fetchIndustries();
  }, [fetchQuestions, fetchIndustries]);

  const industryOptions = industries.map((i) => ({ value: i.slug, label: i.name }));
  const questionFields = [
    { key: 'question', label: 'Question', type: 'text' as const, required: true },
    {
      key: 'industrySlug',
      label: 'Industry',
      type: 'select' as const,
      required: true,
      options: industryOptions,
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: CATEGORY_OPTIONS,
    },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isActive', label: 'Active', type: 'boolean' as const, placeholder: 'Visible to users' },
  ];

  const handleAdd = () => {
    setEditing(null);
    setFormData({ ...DEFAULT_FORM_DATA });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({
      question: item.question ?? '',
      industrySlug: item.industrySlug ?? '',
      category: item.category ?? '',
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete question "${item.question}"?`)) return;
    try {
      await adminApi.deleteQuestion(item.id);
      await fetchQuestions();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        question: formData.question,
        industrySlug: formData.industrySlug,
        category: formData.category,
        sortOrder: Number(formData.sortOrder) ?? 0,
        isActive: !!formData.isActive,
      };
      if (editing) {
        await adminApi.updateQuestion(editing.id, payload);
      } else {
        await adminApi.createQuestion(payload);
      }
      setShowForm(false);
      await fetchQuestions();
    } catch (err) {
      alert((err as Error).message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <AdminTable
        title="Predefined Questions"
        columns={[
          { key: 'question', label: 'Question' },
          { key: 'category', label: 'Category' },
          {
            key: 'industrySlug',
            label: 'Industry',
            render: (_: unknown, row: any) => (
              <span className="text-slate-600 dark:text-slate-300">
                {row.industry?.name ?? row.industrySlug ?? '—'}
              </span>
            ),
          },
          { key: 'sortOrder', label: 'Sort Order' },
          {
            key: 'isActive',
            label: 'Active',
            render: (v: unknown) => (
              <span className={v ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-500'}>
                {v ? 'Yes' : 'No'}
              </span>
            ),
          },
        ]}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <AdminFormModal
          title={editing ? 'Edit Question' : 'Add Question'}
          fields={questionFields}
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
