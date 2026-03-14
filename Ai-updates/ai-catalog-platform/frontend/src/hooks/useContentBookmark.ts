'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/app.store';

interface SaveParams {
  contentType: string;
  contentId: string;
  title: string;
  url?: string;
  metadata?: Record<string, any>;
}

export function useContentBookmark(contentType: string, contentId: string) {
  const { accessToken } = useAppStore();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken || !contentId) return;
    fetch(`/api/student/saved-content/check?contentType=${contentType}&ids=${contentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(r => r.json())
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setIsSaved(res.data.includes(contentId));
        }
      })
      .catch(() => {});
  }, [accessToken, contentType, contentId]);

  const toggle = useCallback(async (params: Omit<SaveParams, 'contentType' | 'contentId'> & { contentType?: string; contentId?: string }) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      if (isSaved) {
        await fetch(`/api/student/saved-content/${contentType}/${contentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsSaved(false);
      } else {
        await fetch('/api/student/saved-content', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentType,
            contentId,
            title: params.title,
            url: params.url || '',
            metadata: params.metadata || {},
          }),
        });
        setIsSaved(true);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [accessToken, isSaved, contentType, contentId]);

  return { isSaved, loading, toggle };
}
