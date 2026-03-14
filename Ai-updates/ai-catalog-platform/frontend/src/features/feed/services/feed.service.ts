import { feedRepository } from '../repositories/feed.repository';
import { QueryFeedRequestDto } from '../dtos/feed.dto';
import { FeedItemModel } from '../models/feed.model';
import { FeedItem } from '../types/feed.types';

export class FeedService {
  async getPaginatedFeed(params: QueryFeedRequestDto) {
    const rawData = await feedRepository.getFeed(params);
    // Maps API response to safe frontend models
    return {
      ...rawData,
      data: ((rawData.data || []) as any[]).map(item => FeedItemModel.fromResponse(item))
    };
  }

  async getTrendingFeed(): Promise<FeedItem[]> {
    const rawData = await feedRepository.getTrending();
    return (rawData.data || []).map((item: any) => FeedItemModel.fromResponse(item));
  }

  async getFeedFields() {
    return feedRepository.getFields();
  }
}

export const feedService = new FeedService();
