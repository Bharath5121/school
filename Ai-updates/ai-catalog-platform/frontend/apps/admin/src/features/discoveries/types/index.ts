export interface Industry {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface DiscoveryLink {
  id: string;
  type: 'MODEL' | 'AGENT' | 'APP';
  name: string;
  description?: string;
  redirectUrl?: string;
  sortOrder: number;
}

export interface Discovery {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  coverImageUrl?: string;
  industrySlug: string;
  difficulty: string;
  videoUrl?: string;
  videoTitle?: string;
  notebookLmUrl?: string;
  notebookDescription?: string;
  architectureDescription?: string;
  architectureDiagramUrl?: string;
  isPublished: boolean;
  publishedAt?: string;
  isFeatured: boolean;
  sortOrder: number;
  xp: number;
  createdAt: string;
  updatedAt?: string;
  industry?: { name: string; slug: string; icon?: string; color?: string };
  links?: DiscoveryLink[];
  _count?: { links: number; chatMessages: number };
}
