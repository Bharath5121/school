'use client';

import { useCallback, useEffect, useState } from 'react';
import { myStuffApi } from '../services/my-stuff.api';

export function useSaveButton(contentType: string, contentId: string, title: string, url?: string, metadata?: any) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) return;
    myStuffApi.checkSaved(contentType, contentId)
      .then(setSaved)
      .catch(() => setSaved(false))
      .finally(() => setLoading(false));
  }, [contentType, contentId]);

  const toggle = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (saved) {
        await myStuffApi.unsaveItem(contentType, contentId);
        setSaved(false);
      } else {
        await myStuffApi.saveItem({ contentType, contentId, title, url, metadata });
        setSaved(true);
      }
    } catch {
      // no-op
    }
    setLoading(false);
  }, [saved, loading, contentType, contentId, title, url, metadata]);

  return { saved, loading, toggle };
}
