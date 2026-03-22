'use client';

import { useState, useEffect } from 'react';
import { discoveriesApi } from '../services/discoveries.api';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import type { Discovery } from '../types';

const INITIAL_FORM: Partial<Discovery> = {
  title: '', slug: '', summary: '', description: '', coverImageUrl: '',
  industrySlug: '', difficulty: 'BEGINNER',
  videoUrl: '', videoTitle: '',
  notebookLmUrl: '', notebookDescription: '',
  architectureDescription: '', architectureDiagramUrl: '',
  isPublished: false, isFeatured: false, sortOrder: 0, xp: 0,
};

const DIFFICULTY_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

interface Props {
  editing: Discovery | null;
  industryOptions: { value: string; label: string }[];
  onClose: () => void;
  onSaved: () => void;
}

export function DiscoveryFormDialog({ editing, industryOptions, onClose, onSaved }: Props) {
  const [formData, setFormData] = useState<Partial<Discovery>>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setFormData({
        title: editing.title ?? '', slug: editing.slug ?? '',
        summary: editing.summary ?? '', description: editing.description ?? '',
        coverImageUrl: editing.coverImageUrl ?? '', industrySlug: editing.industrySlug ?? '',
        difficulty: editing.difficulty ?? 'BEGINNER',
        videoUrl: editing.videoUrl ?? '', videoTitle: editing.videoTitle ?? '',
        notebookLmUrl: editing.notebookLmUrl ?? '',
        notebookDescription: editing.notebookDescription ?? '',
        architectureDescription: editing.architectureDescription ?? '',
        architectureDiagramUrl: editing.architectureDiagramUrl ?? '',
        isPublished: editing.isPublished ?? false, isFeatured: editing.isFeatured ?? false,
        sortOrder: editing.sortOrder ?? 0, xp: editing.xp ?? 0,
      });
    } else {
      setFormData({ ...INITIAL_FORM });
    }
  }, [editing]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: any = { ...formData };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '') payload[k] = undefined;
      });
      payload.coverImageUrl = formData.coverImageUrl || undefined;
      payload.videoUrl = formData.videoUrl || undefined;
      payload.notebookLmUrl = formData.notebookLmUrl || undefined;
      payload.architectureDiagramUrl = formData.architectureDiagramUrl || undefined;

      if (editing) {
        await discoveriesApi.update(editing.id, payload);
      } else {
        await discoveriesApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      alert((err as Error).message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: '_section_basic', label: '── Basic Info ──', type: 'section' as const },
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'ai-discovers-new-planet' },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },
    { key: 'difficulty', label: 'Difficulty', type: 'select' as const, options: DIFFICULTY_OPTIONS },
    { key: 'summary', label: 'Summary (card text)', type: 'textarea' as const, required: true },
    { key: 'description', label: 'Full Description (markdown)', type: 'textarea' as const, required: true },
    { key: 'coverImageUrl', label: 'Cover Image URL', type: 'url' as const },

    { key: '_section_video', label: '── Video ──', type: 'section' as const },
    { key: 'videoUrl', label: 'YouTube / Video URL', type: 'url' as const },
    { key: 'videoTitle', label: 'Video Title', type: 'text' as const },

    { key: '_section_notebook', label: '── Notebook ──', type: 'section' as const },
    { key: 'notebookLmUrl', label: 'NotebookLM URL', type: 'url' as const },
    { key: 'notebookDescription', label: 'Notebook Description', type: 'textarea' as const },

    { key: '_section_arch', label: '── Architecture ──', type: 'section' as const },
    { key: 'architectureDescription', label: 'Architecture Description (markdown)', type: 'textarea' as const },
    { key: 'architectureDiagramUrl', label: 'Architecture Diagram URL', type: 'url' as const },

    { key: '_section_settings', label: '── Settings ──', type: 'section' as const },
    { key: 'xp', label: 'XP Points', type: 'number' as const },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'isFeatured', label: 'Featured (Today\'s Pick)', type: 'boolean' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  return (
    <AdminFormModal
      title={editing ? 'Edit Discovery' : 'Add Discovery'}
      fields={fields}
      data={formData}
      onChange={(key, value) => setFormData(prev => ({ ...prev, [key]: value }))}
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={saving}
    />
  );
}
