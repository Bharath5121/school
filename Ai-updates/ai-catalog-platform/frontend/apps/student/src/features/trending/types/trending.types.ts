export interface TrendingCategorySummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  _count: { apps: number };
}

export interface TrendingCategoryDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  apps: TrendingAppSummary[];
}

export interface TrendingAppSummary {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  icon: string | null;
  logoUrl: string | null;
  provider: string | null;
  url: string | null;
  isFree: boolean;
  isAd: boolean;
  launchDate: string | null;
  industry?: { name: string; slug: string; icon: string } | null;
  category?: { title: string; slug: string; icon: string } | null;
}

export interface TrendingAppDetail extends TrendingAppSummary {
  description: string | null;
  usage: string | null;
  howItHelps: string | null;
  coverImageUrl: string | null;
}

export interface MyAppsResponse {
  industries: { name: string; slug: string; icon: string }[];
  apps: TrendingAppSummary[];
}
