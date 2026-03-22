export interface IndustryListItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  _count: { models: number; agents: number; apps: number; questions: number };
}

export interface IndustryDetail extends IndustryListItem {
  description?: string;
  gradient?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
