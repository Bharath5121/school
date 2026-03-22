export interface IndustryListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  sortOrder: number;
  isActive: boolean;
  _count: { models: number; agents: number; apps: number; discoveries: number };
}

export interface IndustryDetail extends IndustryListItem {
  discoveries: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    coverImageUrl: string | null;
    difficulty: string;
    xp: number;
    publishedAt: string | null;
  }[];
}
