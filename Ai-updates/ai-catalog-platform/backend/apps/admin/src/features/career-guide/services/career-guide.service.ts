import { CareerGuideRepository } from '../repositories/career-guide.repository';
import { CareerGuideCacheKeys } from '../cache/career-guide.cache';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreateGuideDto, UpdateGuideDto } from '../dtos/career-guide.dto';

export class CareerGuideService {
  private repo = new CareerGuideRepository();

  async getAll() { return this.repo.findAll(); }
  async getById(id: string) { return this.repo.findById(id); }

  async create(data: CreateGuideDto) {
    const guide = await this.repo.create(data);
    await cacheDelPattern(CareerGuideCacheKeys.pattern());
    return guide;
  }

  async update(id: string, data: UpdateGuideDto) {
    const guide = await this.repo.update(id, data);
    await cacheDelPattern(CareerGuideCacheKeys.pattern());
    return guide;
  }

  async delete(id: string) {
    const guide = await this.repo.delete(id);
    await cacheDelPattern(CareerGuideCacheKeys.pattern());
    return guide;
  }
}
