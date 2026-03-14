import { SkillRepository } from '../repositories/skill.repository';

const repo = new SkillRepository();

export class SkillService {
  async getProgress(userId: string) {
    return repo.findByUser(userId);
  }

  async updateStatus(userId: string, skillId: string, status: 'NOT_STARTED' | 'EXPLORING' | 'LEARNED') {
    return repo.upsertStatus(userId, skillId, status);
  }

  async getSummary(userId: string) {
    return repo.getSummary(userId);
  }
}
