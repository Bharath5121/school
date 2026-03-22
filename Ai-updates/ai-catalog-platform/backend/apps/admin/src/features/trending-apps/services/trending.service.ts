import { TrendingRepository } from '../repositories/trending.repository';
import { TrendingCacheKeys } from '../cache/trending.cache';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreateCategoryDto, UpdateCategoryDto, CreateAppDto, UpdateAppDto } from '../dtos/trending.dto';

export class TrendingService {
  private repo = new TrendingRepository();

  async getAllCategories() { return this.repo.findAllCategories(); }
  async getCategoryById(id: string) { return this.repo.findCategoryById(id); }

  async createCategory(data: CreateCategoryDto) {
    const r = await this.repo.createCategory(data);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const r = await this.repo.updateCategory(id, data);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }

  async deleteCategory(id: string) {
    const r = await this.repo.deleteCategory(id);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }

  async getAllApps() { return this.repo.findAllApps(); }
  async getAppById(id: string) { return this.repo.findAppById(id); }

  async createApp(data: CreateAppDto) {
    const r = await this.repo.createApp(data);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }

  async updateApp(id: string, data: UpdateAppDto) {
    const r = await this.repo.updateApp(id, data);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }

  async deleteApp(id: string) {
    const r = await this.repo.deleteApp(id);
    await cacheDelPattern(TrendingCacheKeys.pattern());
    return r;
  }
}
