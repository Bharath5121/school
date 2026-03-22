import { DashboardUser, TopStory, TrendingItem, RecentFeedItem, FieldFeeds } from '../types/dashboard.types';

export interface DashboardResponseDto {
  summary: {
    user: DashboardUser;
    topStory: TopStory | null;
  };
  interests: string[];
  recentItems: RecentFeedItem[];
  trending: TrendingItem[];
  fieldFeeds: FieldFeeds;
}
