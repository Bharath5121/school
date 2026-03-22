export const TrendingCacheKeys = {
  categoryList: () => 'trending:categories',
  categoryById: (id: string) => `trending:category:${id}`,
  appList: () => 'trending:apps',
  appById: (id: string) => `trending:app:${id}`,
  pattern: () => 'trending:*',
};
