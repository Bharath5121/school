export interface CareerJobCard {
  id: string;
  title: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  demand: 'GROWING' | 'STABLE' | 'AT_RISK';
  timeline: 'NOW' | 'YEAR_2030' | 'FUTURE';
  requiredDegree: string;
  sortOrder: number;
}

export interface CareerPathSummary {
  id: string;
  title: string;
  description: string;
  aiImpactSummary: string;
  industrySlug: string;
  industry: { name: string; slug: string; icon: string };
  jobs: CareerJobCard[];
}

export interface CareerJobDetail {
  id: string;
  title: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  demand: 'GROWING' | 'STABLE' | 'AT_RISK';
  timeline: 'NOW' | 'YEAR_2030' | 'FUTURE';
  requiredDegree: string;
  requiredSkills: string[];
  futureSkills: string[];
  howAiChanges: string;
  googleUrl: string | null;
  notebookLmUrl: string | null;
  careerPath: {
    id: string;
    title: string;
    description: string;
    aiImpactSummary: string;
    industrySlug: string;
    industry: { name: string; slug: string; icon: string };
  };
}

export interface MyCareerResponse {
  industries: { name: string; slug: string; icon: string }[];
  paths: CareerPathSummary[];
}
