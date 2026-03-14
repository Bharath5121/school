export interface BasicsTopicSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  color: string;
  sortOrder: number;
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
  videos: { id: string; title: string; url: string; channel: string; duration: string }[];
  articles: { id: string; title: string; url: string; source: string }[];
}
