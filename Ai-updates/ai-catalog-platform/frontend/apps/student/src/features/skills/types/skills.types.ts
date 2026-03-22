export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface SkillSummary {
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
  industry: { name: string; slug: string; icon: string };
}

export interface MySkillsResponse {
  industries: { name: string; slug: string; icon: string }[];
  skills: SkillSummary[];
}
