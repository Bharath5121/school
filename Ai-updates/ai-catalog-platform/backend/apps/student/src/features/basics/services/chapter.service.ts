import { ChapterRepository } from '../repositories/chapter.repository';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { BasicsCacheKeys, BasicsCacheTTL } from '../cache/basics.cache';

export class ChapterService {
  private repository = new ChapterRepository();

  async getChaptersWithTopics() {
    const cacheKey = BasicsCacheKeys.chapters();
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const chapters = await this.repository.findAllWithTopics();
    await cacheSet(cacheKey, chapters, BasicsCacheTTL.CHAPTERS_LIST);
    return chapters;
  }

  async getChapterCount() {
    return this.repository.count();
  }
}
