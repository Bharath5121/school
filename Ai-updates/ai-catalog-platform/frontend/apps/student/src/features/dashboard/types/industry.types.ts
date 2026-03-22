export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  _count?: {
    models: number;
    agents: number;
    newsItems: number;
    apps: number;
  };
}

export type FieldSlug = string;

export interface PlatformStats {
  totalModels: number;
  totalFields: number;
  updatesToday: number;
}
