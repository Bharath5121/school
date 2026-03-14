import { BasicsTopicSummary, BasicsTopicDetail } from '../types/basics.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const basicsApi = {
  async getTopics(): Promise<BasicsTopicSummary[]> {
    const res = await fetch(`${API_BASE}/home/basics/topics`);
    const json = await res.json();
    return json.data || [];
  },

  async getTopicDetail(slug: string): Promise<BasicsTopicDetail | null> {
    const res = await fetch(`${API_BASE}/home/basics/topics/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  },
};
