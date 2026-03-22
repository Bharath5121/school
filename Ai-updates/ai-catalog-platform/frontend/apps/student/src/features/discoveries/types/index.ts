export interface DiscoveryLink {
  id: string;
  type: 'MODEL' | 'AGENT' | 'APP';
  name: string;
  description?: string;
  redirectUrl?: string;
  sortOrder: number;
}

export interface DiscoveryIndustry {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface DiscoveryCard {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl?: string;
  industrySlug: string;
  difficulty: string;
  isFeatured: boolean;
  xp: number;
  publishedAt?: string;
  videoUrl?: string;
  notebookLmUrl?: string;
  architectureDescription?: string;
  industry?: DiscoveryIndustry;
  _count?: { links: number };
}

export interface DiscoveryDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImageUrl?: string;
  industrySlug: string;
  difficulty: string;
  videoUrl?: string;
  videoTitle?: string;
  notebookLmUrl?: string;
  notebookDescription?: string;
  architectureDescription?: string;
  architectureDiagramUrl?: string;
  isFeatured: boolean;
  xp: number;
  publishedAt?: string;
  industry?: DiscoveryIndustry;
  links: DiscoveryLink[];
}

export interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  createdAt: string;
  user: { id: string; name: string };
}
