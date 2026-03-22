export interface BasicsVideo {
  id: string;
  title: string;
  url: string;
  channel?: string | null;
  duration?: string | null;
  sortOrder: number;
  topicId: string;
}

export interface BasicsArticle {
  id: string;
  title: string;
  url: string;
  source?: string | null;
  sortOrder: number;
  topicId: string;
}

export interface BasicsTopic {
  id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder: number;
  concepts?: string[];
  keyTakeaways?: string[];
  isPublished: boolean;
  videos?: BasicsVideo[];
  articles?: BasicsArticle[];
  createdAt: Date;
  updatedAt: Date;
}
