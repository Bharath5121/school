import { LabRepository } from '../repositories/lab.repository';
import { LabCacheKeys, LabCacheTTL } from '../cache/lab.cache';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';

export class LabService {
  private repo = new LabRepository();

  async getCategories() {
    const cached = await cacheGet(LabCacheKeys.categories());
    if (cached) return cached;
    const data = await this.repo.findAllCategories();
    await cacheSet(LabCacheKeys.categories(), data, LabCacheTTL.CATEGORIES);
    return data;
  }

  async getCategoryBySlug(slug: string) {
    const cached = await cacheGet(LabCacheKeys.categoryBySlug(slug));
    if (cached) return cached;
    const data = await this.repo.findCategoryBySlug(slug);
    if (data) await cacheSet(LabCacheKeys.categoryBySlug(slug), data, LabCacheTTL.CATEGORY);
    return data;
  }

  async getItemBySlug(slug: string) {
    const cached = await cacheGet(LabCacheKeys.itemBySlug(slug));
    if (cached) return cached;
    const data = await this.repo.findItemBySlug(slug);
    if (data) await cacheSet(LabCacheKeys.itemBySlug(slug), data, LabCacheTTL.ITEM);
    return data;
  }

  async getChatMessages(itemSlug: string) {
    return this.repo.findChatMessages(itemSlug);
  }

  async sendChatMessage(itemSlug: string, userId: string, message: string) {
    return this.repo.createChatMessage(itemSlug, userId, message);
  }
}
