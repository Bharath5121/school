export const SkillsCacheKeys = {
  list: () => 'skills:list',
  byId: (id: string) => `skills:${id}`,
  pattern: () => 'skills:*',
};
