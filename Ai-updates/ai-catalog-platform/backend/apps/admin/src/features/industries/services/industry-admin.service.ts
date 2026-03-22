import { industryRepository } from '../repositories/industry.repository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreateIndustryDto, UpdateIndustryDto } from '../dtos/create-industry.dto';

export class IndustryAdminService {
  async create(data: CreateIndustryDto) {
    const result = await industryRepository.create(data);
    await cacheDelPattern('admin:industries:*');
    return result;
  }

  async update(id: string, data: UpdateIndustryDto) {
    const existing = await industryRepository.findById(id);
    if (!existing) throw new NotFoundError('Industry', id);
    const result = await industryRepository.update(id, data);
    await cacheDelPattern('admin:industries:*');
    return result;
  }

  async delete(id: string) {
    const existing = await industryRepository.findById(id);
    if (!existing) throw new NotFoundError('Industry', id);
    await industryRepository.delete(id);
    await cacheDelPattern('admin:industries:*');
  }
}

export const industryAdminService = new IndustryAdminService();
