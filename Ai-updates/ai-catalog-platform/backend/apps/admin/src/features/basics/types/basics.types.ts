export interface BasicsTopicListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  createdAt: Date;
  _count: {
    videos: number;
    articles: number;
  };
}

export interface BasicsVideo {
  id: string;
  title: string;
  url: string;
  duration: string;
  sortOrder: number;
}

export interface BasicsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
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
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  videos: BasicsVideo[];
  articles: BasicsArticle[];
}
