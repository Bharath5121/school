export interface BasicsChapter {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  topics?: BasicsTopic[];
  _count?: { topics: number };
}

export interface BasicsTopic {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  concepts: string[];
  keyTakeaways: string[];
  difficulty: string;
  xp: number;
  videoUrl: string | null;
  videoTitle: string | null;
  notebookLmUrl: string | null;
  notebookDescription: string | null;
  architectureDescription: string | null;
  architectureDiagramUrl: string | null;
  isPublished: boolean;
  chapterId: string | null;
  chapter?: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
  videos: BasicsVideo[];
  articles: BasicsArticle[];
  links: BasicsTopicLink[];
  _count?: { videos: number; articles: number };
}

export interface BasicsVideo {
  id: string;
  title: string;
  url: string;
  channel: string;
  duration: string;
  sortOrder: number;
  topicId: string;
  createdAt: string;
}

export interface BasicsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  sortOrder: number;
  topicId: string;
  createdAt: string;
}

export interface BasicsTopicLink {
  id: string;
  topicId?: string;
  type: 'MODEL' | 'AGENT' | 'APP';
  name: string;
  description: string | null;
  redirectUrl: string | null;
  sortOrder: number;
}
