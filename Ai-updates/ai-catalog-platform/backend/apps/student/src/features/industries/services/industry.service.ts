import { industryRepository } from '../repositories/industry.repository';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { CacheKeys } from '../../../shared/utils/cache-keys';
import { APP_CONSTANTS } from '../../../config/constants';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class IndustryService {
  async getAll() {
    const cached = await cacheGet<unknown[]>(CacheKeys.industries.all());
    if (cached) return cached;

    const data = await industryRepository.findAllActive();
    await cacheSet(CacheKeys.industries.all(), data, APP_CONSTANTS.CACHE_TTL.MEDIUM);
    return data;
  }

  async getBySlug(slug: string) {
    const cacheKey = CacheKeys.industries.bySlug(slug);
    const cached = await cacheGet<unknown>(cacheKey);
    if (cached) return cached;

    const data = await industryRepository.findBySlug(slug);
    if (!data) throw new NotFoundError('Industry', slug);

    await cacheSet(cacheKey, data, APP_CONSTANTS.CACHE_TTL.MEDIUM);
    return data;
  }
}

export const industryService = new IndustryService();
