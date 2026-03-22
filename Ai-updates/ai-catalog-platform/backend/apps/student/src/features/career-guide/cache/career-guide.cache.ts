export const CareerGuideCacheKeys = {
  myGuides: (userId: string) => `career-guide:my:${userId}`,
  byId: (id: string) => `career-guide:${id}`,
};

export const CareerGuideCacheTTL = {
  MY_GUIDES: 300,
  GUIDE: 300,
};
