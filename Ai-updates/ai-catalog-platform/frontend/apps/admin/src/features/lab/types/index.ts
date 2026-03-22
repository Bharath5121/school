export interface LabCategory {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  items?: LabItem[];
  _count?: { items: number };
}

export interface LabItem {
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
  sortOrder: number;
  isPublished: boolean;
  categoryId: string;
  category?: { id: string; title: string; slug: string };
  createdAt: string;
  updatedAt: string;
}
