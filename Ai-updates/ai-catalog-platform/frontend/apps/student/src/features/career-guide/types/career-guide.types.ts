export type GuideDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CareerGuideSummary {
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
  industry: { name: string; slug: string; icon: string };
}

export interface MyGuidesResponse {
  industries: { name: string; slug: string; icon: string }[];
  guides: CareerGuideSummary[];
}
