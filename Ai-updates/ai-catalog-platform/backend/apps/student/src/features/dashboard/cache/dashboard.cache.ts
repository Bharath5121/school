export const DASHBOARD_CACHE_KEYS = {
  summary: (userId: string) => `dashboard:summary:${userId}`,
  trending: () => 'dashboard:trending',
  fieldFeeds: (userId: string) => `dashboard:fieldFeeds:${userId}`,
} as const;

export const DASHBOARD_CACHE_TTL = {
  summary: 300,
  trending: 600,
  fieldFeeds: 300,
} as const;
