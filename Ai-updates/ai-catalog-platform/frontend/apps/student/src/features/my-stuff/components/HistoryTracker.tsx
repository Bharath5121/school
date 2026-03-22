'use client';

import { useEffect } from 'react';
import { myStuffApi } from '../services/my-stuff.api';

interface HistoryTrackerProps {
  contentType: string;
  contentId: string;
  title: string;
  slug?: string;
  icon?: string;
  metadata?: any;
}

export function HistoryTracker({ contentType, contentId, title, slug, icon, metadata }: HistoryTrackerProps) {
  useEffect(() => {
    if (!contentId || !title) return;
    myStuffApi.trackView({ contentType, contentId, title, slug, icon, metadata });
  }, [contentType, contentId, title, slug, icon, metadata]);

  return null;
}
