import { CareerGuideRepository } from '../repositories/career-guide.repository';
import { CareerGuideCacheKeys, CareerGuideCacheTTL } from '../cache/career-guide.cache';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';

export class CareerGuideService {
  private repo = new CareerGuideRepository();

  async getMyGuides(userId: string) {
    const cached = await cacheGet(CareerGuideCacheKeys.myGuides(userId));
    if (cached) return cached;

    const selections = await this.repo.getUserIndustries(userId);
    if (selections.length === 0) return { industries: [], guides: [] };

    const guides = await this.repo.findByIndustries(selections.map((s) => s.industrySlug));
    const payload = {
      industries: selections.map((s) => s.industry),
      guides,
    };
    await cacheSet(CareerGuideCacheKeys.myGuides(userId), payload, CareerGuideCacheTTL.MY_GUIDES);
    return payload;
  }

  async getGuideById(id: string) {
    const cached = await cacheGet(CareerGuideCacheKeys.byId(id));
    if (cached) return cached;

    const guide = await this.repo.findById(id);
    if (guide) await cacheSet(CareerGuideCacheKeys.byId(id), guide, CareerGuideCacheTTL.GUIDE);
    return guide;
  }
}
