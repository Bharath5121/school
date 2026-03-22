export interface ContentStats {
  industries: number;
  models: number;
  agents: number;
  apps: number;
  questions: number;
  basicsTopics: number;
  basicsVideos: number;
  basicsArticles: number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalContent: number;
  recentActivity: unknown[];
  roles: Record<string, number>;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
