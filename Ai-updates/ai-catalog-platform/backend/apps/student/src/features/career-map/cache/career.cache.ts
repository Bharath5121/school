export const CareerCacheKeys = {
  myPaths: (userId: string) => `career:my-paths:${userId}`,
  jobById: (id: string) => `career:job:${id}`,
};

export const CareerCacheTTL = {
  MY_PATHS: 300,
  JOB: 300,
};
