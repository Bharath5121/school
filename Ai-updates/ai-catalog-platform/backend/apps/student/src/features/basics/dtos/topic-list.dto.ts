export interface TopicListDto {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  difficulty: string;
  xp: number;
  chapterId: string | null;
  _count: { videos: number; articles: number };
}
