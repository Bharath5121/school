export const CacheKeys = {
  industries: {
    all: () => 'industries:all',
    bySlug: (slug: string) => `industries:slug:${slug}`,
    stats: () => 'industries:stats',
    fieldStats: (slugs: string) => `industries:field-stats:${slugs}`,
    latest: (slug: string) => `industries:latest:${slug}`,
  },
  explore: {
    models: (filter: string) => `explore:models:${filter}`,
    model: (id: string) => `explore:model:${id}`,
    agents: (filter: string) => `explore:agents:${filter}`,
    agent: (id: string) => `explore:agent:${id}`,
    apps: (filter: string) => `explore:apps:${filter}`,
  },
  basics: {
    topics: () => 'basics:topics',
    topic: (slug: string) => `basics:topic:${slug}`,
  },
  guides: {
    list: (filter: string) => `guides:list:${filter}`,
    detail: (id: string) => `guides:detail:${id}`,
    prompts: (filter: string) => `guides:prompts:${filter}`,
  },
  trending: {
    list: (params: string) => `trending:list:${params}`,
    whatsNew: (params: string) => `trending:whats-new:${params}`,
  },
  home: {
    stats: () => 'home:stats',
    industries: () => 'home:industries',
  },
  dashboard: {
    summary: (userId: string) => `dashboard:summary:${userId}`,
  },
} as const;
