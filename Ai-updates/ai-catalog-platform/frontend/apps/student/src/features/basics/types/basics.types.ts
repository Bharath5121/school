export interface BasicsTopicSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  color: string;
  sortOrder: number;
  difficulty: string;
  xp: number;
  videoUrl: string | null;
  notebookLmUrl: string | null;
  architectureDescription: string | null;
  _count: { videos: number; articles: number; links: number };
}

export interface BasicsChapter {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  topics: BasicsTopicSummary[];
}

export interface BasicsTopicLink {
  id: string;
  type: 'MODEL' | 'AGENT' | 'APP';
  name: string;
  description: string | null;
  redirectUrl: string | null;
  sortOrder: number;
}

export interface BasicsTopicChatMsg {
  id: string;
  message: string;
  response: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

export interface BasicsTopicDetail {
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
  videos: { id: string; title: string; url: string; channel: string; duration: string }[];
  articles: { id: string; title: string; url: string; source: string }[];
  links: BasicsTopicLink[];
}
