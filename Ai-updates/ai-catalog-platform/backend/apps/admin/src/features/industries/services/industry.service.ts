import { industryRepository } from '../repositories/industry.repository';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { CacheKeys } from '../../../shared/utils/cache-keys';
import { APP_CONSTANTS } from '../../../config/constants';

export class IndustryService {
  async getAll() {
    const cached = await cacheGet<any[]>(CacheKeys.industries.all());
    if (cached) return cached;
    const data = await industryRepository.findAll();
    await cacheSet(CacheKeys.industries.all(), data, APP_CONSTANTS.CACHE_TTL.MEDIUM);
    return data;
  }

  async getById(id: string) {
    return industryRepository.findById(id);
  }
}

export const industryService = new IndustryService();
