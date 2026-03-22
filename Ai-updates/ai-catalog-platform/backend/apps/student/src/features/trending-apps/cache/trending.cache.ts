export const TrendingCacheKeys = {
  categories: () => 'trending:categories',
  categoryBySlug: (slug: string) => `trending:category:slug:${slug}`,
  byIndustry: (slug: string) => `trending:industry:${slug}`,
};

export const TrendingCacheTTL = {
  CATEGORIES: 300,
  CATEGORY: 300,
  BY_INDUSTRY: 300,
};
