import { CareerRepository } from '../repositories/career.repository';
import { CareerCacheKeys, CareerCacheTTL } from '../cache/career.cache';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';

export class CareerService {
  private repo = new CareerRepository();

  async getMyPaths(userId: string) {
    const cached = await cacheGet(CareerCacheKeys.myPaths(userId));
    if (cached) return cached;

    const selections = await this.repo.getUserIndustries(userId);
    if (selections.length === 0) return { industries: [], paths: [] };

    const slugs = selections.map(s => s.industrySlug);
    const paths = await this.repo.findPathsByIndustries(slugs);

    const result = {
      industries: selections.map(s => s.industry),
      paths,
    };

    await cacheSet(CareerCacheKeys.myPaths(userId), result, CareerCacheTTL.MY_PATHS);
    return result;
  }

  async getJobById(id: string) {
    const cached = await cacheGet(CareerCacheKeys.jobById(id));
    if (cached) return cached;

    const data = await this.repo.findJobById(id);
    if (data) await cacheSet(CareerCacheKeys.jobById(id), data, CareerCacheTTL.JOB);
    return data;
  }
}
