'use client';
import { useState, useEffect } from 'react';
import { basicsApi } from '../services/basics.api';
import { BasicsTopicSummary, BasicsTopicDetail } from '../types/basics.types';

export function useBasicsTopics() {
  const [topics, setTopics] = useState<BasicsTopicSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    basicsApi.getTopics()
      .then(setTopics)
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  }, []);

  return { topics, loading };
}

export function useBasicsDetail(slug: string) {
  const [topic, setTopic] = useState<BasicsTopicDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    basicsApi.getTopicDetail(slug)
      .then(setTopic)
      .catch(() => setTopic(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return { topic, loading };
}
