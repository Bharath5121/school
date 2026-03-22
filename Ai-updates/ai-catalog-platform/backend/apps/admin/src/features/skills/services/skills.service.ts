import { SkillsRepository } from '../repositories/skills.repository';
import { SkillsCacheKeys } from '../cache/skills.cache';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreateSkillDto, UpdateSkillDto } from '../dtos/skills.dto';

export class SkillsService {
  private repo = new SkillsRepository();

  async getAll() { return this.repo.findAll(); }
  async getById(id: string) { return this.repo.findById(id); }

  async create(data: CreateSkillDto) {
    const r = await this.repo.create(data);
    await cacheDelPattern(SkillsCacheKeys.pattern());
    return r;
  }

  async update(id: string, data: UpdateSkillDto) {
    const r = await this.repo.update(id, data);
    await cacheDelPattern(SkillsCacheKeys.pattern());
    return r;
  }

  async delete(id: string) {
    const r = await this.repo.delete(id);
    await cacheDelPattern(SkillsCacheKeys.pattern());
    return r;
  }
}
