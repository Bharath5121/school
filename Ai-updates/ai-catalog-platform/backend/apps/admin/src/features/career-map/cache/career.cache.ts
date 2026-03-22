export const CareerCacheKeys = {
  pathList: () => 'career:paths',
  pathById: (id: string) => `career:path:${id}`,
  jobList: () => 'career:jobs',
  jobById: (id: string) => `career:job:${id}`,
  pattern: () => 'career:*',
};
