import { TopicRepository } from '../repositories/topic.repository';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { BasicsCacheKeys, BasicsCacheTTL } from '../cache/basics.cache';
import type { TopicListDto } from '../dtos/topic-list.dto';

export class TopicService {
  private repository = new TopicRepository();

  async getAllTopics(): Promise<TopicListDto[]> {
    const cacheKey = BasicsCacheKeys.topics();
    const cached = await cacheGet<TopicListDto[]>(cacheKey);
    if (cached) return cached;

    const topics = await this.repository.findAll();
    await cacheSet(cacheKey, topics, BasicsCacheTTL.TOPICS_LIST);
    return topics;
  }
}
