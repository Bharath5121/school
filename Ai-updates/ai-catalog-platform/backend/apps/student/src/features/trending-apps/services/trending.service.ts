import { TrendingRepository } from '../repositories/trending.repository';
import { TrendingCacheKeys, TrendingCacheTTL } from '../cache/trending.cache';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';

export class TrendingService {
  private repo = new TrendingRepository();

  async getCategories() {
    const cached = await cacheGet(TrendingCacheKeys.categories());
    if (cached) return cached;
    const data = await this.repo.findAllCategories();
    await cacheSet(TrendingCacheKeys.categories(), data, TrendingCacheTTL.CATEGORIES);
    return data;
  }

  async getCategoryBySlug(slug: string) {
    const cached = await cacheGet(TrendingCacheKeys.categoryBySlug(slug));
    if (cached) return cached;
    const data = await this.repo.findCategoryBySlug(slug);
    if (data) await cacheSet(TrendingCacheKeys.categoryBySlug(slug), data, TrendingCacheTTL.CATEGORY);
    return data;
  }

  async getAppsByIndustry(industrySlug: string) {
    const cached = await cacheGet(TrendingCacheKeys.byIndustry(industrySlug));
    if (cached) return cached;
    const data = await this.repo.findAppsByIndustry(industrySlug);
    await cacheSet(TrendingCacheKeys.byIndustry(industrySlug), data, TrendingCacheTTL.BY_INDUSTRY);
    return data;
  }

  async getMyApps(userId: string) {
    const selections = await this.repo.getUserIndustries(userId);
    if (selections.length === 0) return { industries: [], apps: [] };
    const slugs = selections.map(s => s.industrySlug);
    const apps = await this.repo.findAppsByIndustries(slugs);
    return {
      industries: selections.map(s => s.industry),
      apps,
    };
  }

  async getAppBySlug(slug: string) {
    return this.repo.findAppBySlug(slug);
  }
}
