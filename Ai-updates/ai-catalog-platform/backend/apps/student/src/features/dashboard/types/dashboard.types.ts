export interface DashboardUser {
  name: string;
  interests: string[];
  gradeLevel: string | null;
}

export interface TopStory {
  id: string;
  title: string;
  field: string;
  type: string;
  summary: string | null;
}

export interface TrendingItem {
  id: string;
  title: string;
  views: number;
}

export interface RecentFeedItem {
  id: string;
  title: string;
  type: string;
  field: string;
}

export interface FieldFeedItem {
  id: string;
  title: string;
  contentType: string;
  fieldSlug: string;
}

export interface FieldFeeds {
  [slug: string]: FieldFeedItem[];
}

export interface DashboardData {
  user: DashboardUser;
  topStory: TopStory | null;
  trending: TrendingItem[];
  fieldFeeds: FieldFeeds;
  recentFeed: RecentFeedItem[];
}
