export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Skill {
  id: string;
  name: string;
  description: string;
  industrySlug: string;
  level: SkillLevel;
  whyItMatters: string;
  learnUrl: string | null;
  notebookLmUrl: string | null;
  timeToLearn: string;
  category: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
  industry?: { name: string; slug: string; icon: string };
}
