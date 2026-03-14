export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  field: string;
  source: string;
  type: string;
  url?: string;
  views: number;
  tags?: { id: string; name: string }[];
  createdAt: string;
}
