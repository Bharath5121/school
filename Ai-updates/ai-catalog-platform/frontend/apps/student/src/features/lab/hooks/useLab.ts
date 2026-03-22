'use client';

import { useState, useEffect } from 'react';
import { labApi } from '../services/lab.api';
import type { LabCategorySummary, LabCategoryDetail, LabItemDetail } from '../types/lab.types';

export function useLabCategories() {
  const [categories, setCategories] = useState<LabCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    labApi.getCategories()
      .then(setCategories)
      .catch((e) => setError(e?.message || 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

export function useLabCategory(slug: string) {
  const [category, setCategory] = useState<LabCategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    labApi.getCategoryBySlug(slug)
      .then(setCategory)
      .catch((e) => setError(e?.message || 'Failed to load category'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { category, loading, error };
}

export function useLabItem(slug: string) {
  const [item, setItem] = useState<LabItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    labApi.getItemBySlug(slug)
      .then(setItem)
      .catch((e) => setError(e?.message || 'Failed to load item'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { item, loading, error };
}
