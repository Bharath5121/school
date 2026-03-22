export const SkillsCacheKeys = {
  mySkills: (userId: string) => `skills:my:${userId}`,
  byId: (id: string) => `skills:detail:${id}`,
};

export const SkillsCacheTTL = {
  MY_SKILLS: 300,
  DETAIL: 300,
};
