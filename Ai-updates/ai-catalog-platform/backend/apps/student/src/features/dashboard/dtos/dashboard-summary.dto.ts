import { DashboardUser, TrendingItem, RecentFeedItem } from '../types/dashboard.types';

export interface DashboardSummaryDto {
  user: DashboardUser;
  interests: string[];
  recentActivity: RecentFeedItem[];
  stats: {
    trendingCount: number;
    recentCount: number;
    fieldFeedCount: number;
  };
}

export function toDashboardSummaryDto(
  user: DashboardUser,
  trending: TrendingItem[],
  recentFeed: RecentFeedItem[],
  fieldFeedCount: number,
): DashboardSummaryDto {
  return {
    user,
    interests: user.interests,
    recentActivity: recentFeed.slice(0, 5),
    stats: {
      trendingCount: trending.length,
      recentCount: recentFeed.length,
      fieldFeedCount,
    },
  };
}
