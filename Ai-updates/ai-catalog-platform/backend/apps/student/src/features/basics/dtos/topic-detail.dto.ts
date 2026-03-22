import type { TopicListDto } from './topic-list.dto';
import type { BasicsVideo, BasicsArticle } from '../types/basics.types';

export interface TopicDetailDto extends TopicListDto {
  description: string | null;
  concepts: string[];
  videos: BasicsVideo[];
  articles: BasicsArticle[];
}
