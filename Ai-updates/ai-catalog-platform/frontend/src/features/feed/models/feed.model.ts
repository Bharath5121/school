import { FeedItem } from '../types/feed.types';

export class FeedItemModel {
  static fromResponse(data: any): FeedItem {
    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      field: data.field,
      source: data.source,
      type: data.type,
      url: data.url,
      views: data.views || 0,
      tags: data.tags || [],
      createdAt: data.createdAt
    };
  }
}
