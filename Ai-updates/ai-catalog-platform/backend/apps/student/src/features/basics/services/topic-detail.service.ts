import { TopicDetailRepository } from '../repositories/topic-detail.repository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { BasicsCacheKeys, BasicsCacheTTL } from '../cache/basics.cache';

export class TopicDetailService {
  private repository = new TopicDetailRepository();

  async getTopicBySlug(slug: string) {
    const cacheKey = BasicsCacheKeys.topicBySlug(slug);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const topic = await this.repository.findBySlug(slug);
    if (!topic) throw new NotFoundError('Topic');

    await cacheSet(cacheKey, topic, BasicsCacheTTL.TOPIC_DETAIL);
    return topic;
  }

  async getTopicById(id: string) {
    const cacheKey = BasicsCacheKeys.topicById(id);
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const topic = await this.repository.findById(id);
    if (!topic) throw new NotFoundError('Topic');

    await cacheSet(cacheKey, topic, BasicsCacheTTL.TOPIC_DETAIL);
    return topic;
  }
}
