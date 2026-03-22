export interface LabCategorySummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  _count: { items: number };
}

export interface LabCategoryDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  items: LabItemSummary[];
}

export interface LabItemSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  icon: string | null;
  provider: string | null;
  type: 'MODEL' | 'APP';
  features: string[];
}

export interface LabItemDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  provider: string | null;
  type: 'MODEL' | 'APP';
  useCases: string[];
  features: string[];
  category: { id: string; slug: string; title: string };
}

export interface LabChatMsg {
  id: string;
  message: string;
  response: string | null;
  createdAt: string;
  user: { id: string; name: string };
}
