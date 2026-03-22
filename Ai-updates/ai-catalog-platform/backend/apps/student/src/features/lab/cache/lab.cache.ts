export const LabCacheKeys = {
  categories: () => 'lab:categories',
  categoryBySlug: (slug: string) => `lab:category:slug:${slug}`,
  itemBySlug: (slug: string) => `lab:item:slug:${slug}`,
};

export const LabCacheTTL = {
  CATEGORIES: 300,
  CATEGORY: 300,
  ITEM: 300,
};
