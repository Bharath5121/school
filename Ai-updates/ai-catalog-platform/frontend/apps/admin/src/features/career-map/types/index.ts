export interface CareerPath {
  id: string;
  title: string;
  description: string;
  aiImpactSummary: string;
  industrySlug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
  industry?: { name: string; slug: string; icon: string };
  _count?: { jobs: number };
  jobs?: CareerJobSummary[];
}

export interface CareerJobSummary {
  id: string;
  title: string;
  demand: 'GROWING' | 'STABLE' | 'AT_RISK';
  timeline: 'NOW' | 'YEAR_2030' | 'FUTURE';
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  sortOrder: number;
}

export interface CareerJob {
  id: string;
  careerPathId: string;
  title: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  demand: 'GROWING' | 'STABLE' | 'AT_RISK';
  requiredDegree: string;
  requiredSkills: string[];
  futureSkills: string[];
  howAiChanges: string;
  timeline: 'NOW' | 'YEAR_2030' | 'FUTURE';
  googleUrl?: string | null;
  notebookLmUrl?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
  careerPath?: { id: string; title: string; industrySlug: string };
}
