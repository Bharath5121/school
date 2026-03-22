export type GuideDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CareerGuide {
  id: string;
  title: string;
  description: string;
  difficulty: GuideDifficulty;
  timeRequired: string;
  toolsNeeded: string[];
  industrySlug: string;
  whatYouLearn: string;
  steps: unknown;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  industry?: { name: string; slug: string; icon: string };
}
