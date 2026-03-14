export interface IndustryBase {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface IndustryWithCounts extends IndustryBase {
  modelsCount: number;
  agentsCount: number;
  newsCount: number;
  appsCount: number;
}
