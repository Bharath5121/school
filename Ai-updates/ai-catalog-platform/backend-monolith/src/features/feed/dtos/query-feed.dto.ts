import { FeedContentType } from '../types/feed.types';
import { PaginationQuery } from '../types/pagination.types';

export interface QueryFeedDto extends PaginationQuery {
  fieldSlug?: string;
  contentType?: FeedContentType;
  search?: string;
}
