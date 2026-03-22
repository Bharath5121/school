export const BasicsCacheKeys = {
  topics: () => 'basics:topics',
  chapters: () => 'basics:chapters',
  topicBySlug: (slug: string) => `basics:topic:slug:${slug}`,
  topicById: (id: string) => `basics:topic:id:${id}`,
} as const;

export const BasicsCacheTTL = {
  TOPICS_LIST: 300,
  CHAPTERS_LIST: 300,
  TOPIC_DETAIL: 600,
} as const;
