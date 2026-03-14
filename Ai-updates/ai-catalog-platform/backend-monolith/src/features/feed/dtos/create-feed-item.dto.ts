import { FeedContentType, UserRole } from '../types/feed.types';

export interface CreateFeedItemDto {
  title: string;
  summary: string;
  content: string;
  contentType: FeedContentType;
  fieldSlug: string;
  targetRole?: UserRole;
  careerImpactScore?: number;
  careerImpactText?: string;
  metadata?: any;
}
