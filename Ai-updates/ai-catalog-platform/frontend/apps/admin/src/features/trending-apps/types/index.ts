export interface TrendingCategory {
  id: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: { apps: number };
}

export interface TrendingApp {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  icon?: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  provider?: string;
  url?: string;
  isFree: boolean;
  isAd: boolean;
  usage?: string | null;
  howItHelps?: string | null;
  launchDate?: string;
  sortOrder: number;
  isPublished: boolean;
  categoryId: string;
  industrySlug?: string | null;
  createdAt: string;
  updatedAt?: string;
  category?: { id: string; title: string; slug: string };
  industry?: { name: string; slug: string; icon: string } | null;
}
