export interface AIModel {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  industrySlug: string;
  isFree: boolean;
  tryUrl?: string;
  notebookLmUrl?: string;
  releaseDate?: string;
  careerImpact: string;
  whatToLearn: string[];
  tags: string[];
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  industrySlug: string;
  whatItDoes: string;
  humanJobItHelps: string;
  skillsNeeded: string[];
  isFree: boolean;
  tryUrl?: string;
  notebookLmUrl?: string;
  careerImpact: string;
}

export interface AIApp {
  id: string;
  name: string;
  description: string;
  builtBy: string;
  builtByRole: string;
  industrySlug: string;
  whoUsesIt: string;
  tryUrl?: string;
  isFree: boolean;
  careerImpact: string;
}

export interface IndustryDetail {
  models: AIModel[];
  agents: AIAgent[];
  apps: AIApp[];
}
