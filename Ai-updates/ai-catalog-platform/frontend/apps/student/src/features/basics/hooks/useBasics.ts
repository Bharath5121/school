'use client';
import { useState, useEffect } from 'react';
import { basicsApi } from '../services/basics.api';
import type { BasicsChapter, BasicsTopicSummary, BasicsTopicDetail } from '../types/basics.types';

export function useBasicsChapters() {
  const [chapters, setChapters] = useState<BasicsChapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const result = await basicsApi.getChapters();
        if (!cancelled) setChapters(result);
      } catch {
        if (!cancelled) setChapters([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { chapters, loading };
}

export function useBasicsTopics() {
  const [topics, setTopics] = useState<BasicsTopicSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const result = await basicsApi.getTopics();
        if (!cancelled) setTopics(result);
      } catch {
        if (!cancelled) setTopics([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { topics, loading };
}

export function useBasicsDetail(slug: string) {
  const [topic, setTopic] = useState<BasicsTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        const result = await basicsApi.getTopicDetail(slug);
        if (!cancelled) setTopic(result);
      } catch {
        if (!cancelled) setTopic(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [slug]);

  return { topic, loading };
}
