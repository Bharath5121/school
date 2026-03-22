import { SkillsRepository } from '../repositories/skills.repository';
import { SkillsCacheKeys, SkillsCacheTTL } from '../cache/skills.cache';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';

export class SkillsService {
  private repo = new SkillsRepository();

  async getMySkills(userId: string) {
    const cached = await cacheGet(SkillsCacheKeys.mySkills(userId));
    if (cached) return cached;

    const selections = await this.repo.getUserIndustries(userId);
    if (selections.length === 0) return { industries: [], skills: [] };

    const skills = await this.repo.findByIndustries(selections.map(s => s.industrySlug));
    const result = { industries: selections.map(s => s.industry), skills };
    await cacheSet(SkillsCacheKeys.mySkills(userId), result, SkillsCacheTTL.MY_SKILLS);
    return result;
  }

  async getSkillById(id: string) {
    const cached = await cacheGet(SkillsCacheKeys.byId(id));
    if (cached) return cached;

    const data = await this.repo.findById(id);
    if (data) await cacheSet(SkillsCacheKeys.byId(id), data, SkillsCacheTTL.DETAIL);
    return data;
  }
}
