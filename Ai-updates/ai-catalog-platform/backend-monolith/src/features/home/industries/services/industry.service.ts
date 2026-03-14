import { IndustryRepository } from '../repositories/industry.repository';
import { redis } from '../../../../config/redis';
import logger from '../../../../shared/logger/logger';

export class IndustryService {
  private repository = new IndustryRepository();
  private readonly CACHE_KEY = 'home:industries';
  private readonly STATS_KEY = 'home:stats';

  async listIndustries() {
    try {
      const cached = await redis.get(this.CACHE_KEY);
      if (cached) return JSON.parse(cached);

      const industries = await this.repository.getAllActive();
      await redis.setex(this.CACHE_KEY, 1800, JSON.stringify(industries)); // 30 min
      return industries;
    } catch (error) {
      logger.error('Error listing industries', error);
      return this.repository.getAllActive();
    }
  }

  async getIndustryMetadata(slug: string) {
    return this.repository.getBySlug(slug);
  }

  async getStats() {
    try {
      const cached = await redis.get(this.STATS_KEY);
      if (cached) return JSON.parse(cached);

      const stats = await this.repository.getPlatformStats();
      await redis.setex(this.STATS_KEY, 300, JSON.stringify(stats)); // 5 min
      return stats;
    } catch (error) {
      return this.repository.getPlatformStats();
    }
  }

  async getFieldStats(slugs: string[]) {
    return this.repository.getFieldStats(slugs);
  }

  async getLatestByField(slug: string) {
    return this.repository.getLatestByField(slug, 3);
  }
}
