'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { notebookApi } from '../services/notebook.api';

type Category = 'MODELS' | 'AGENTS' | 'APPS' | 'CLASS';

export function useNotebookAccess() {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const openNotebook = useCallback(async (
    industrySlug: string,
    category: Category,
  ) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return null;
    }

    setLoading(true);
    setLimitReached(false);

    try {
      const result = await notebookApi.getAccess(industrySlug, category);
      return result;
    } catch (err: unknown) {
      const error = err as Error & { status?: number };
      if (error.status === 429) {
        setLimitReached(true);
        return null;
      }
      if (error.status === 404) {
        alert('Notebook not available yet for this category.');
      } else {
        alert(error.message || 'Failed to access notebook');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  const dismissLimit = useCallback(() => setLimitReached(false), []);

  return { openNotebook, loading, limitReached, dismissLimit };
}
