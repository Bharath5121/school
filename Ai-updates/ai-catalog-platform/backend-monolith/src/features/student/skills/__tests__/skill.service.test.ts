import { SkillService } from '../services/skill.service';
import { SkillRepository } from '../repositories/skill.repository';

jest.mock('../repositories/skill.repository');

const mockRepo = SkillRepository.prototype as jest.Mocked<SkillRepository>;

describe('SkillService', () => {
  let service: SkillService;
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SkillService();
  });

  describe('getProgress', () => {
    it('should return skill progress for a user', async () => {
      const progress = [
        { id: 'sp1', userId, skillId: 's1', status: 'LEARNED' },
        { id: 'sp2', userId, skillId: 's2', status: 'EXPLORING' },
        { id: 'sp3', userId, skillId: 's3', status: 'NOT_STARTED' },
      ];
      mockRepo.findByUser.mockResolvedValue(progress as any);

      const result = await service.getProgress(userId);

      expect(result).toEqual(progress);
      expect(result).toHaveLength(3);
      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId);
    });

    it('should return empty array for user with no progress', async () => {
      mockRepo.findByUser.mockResolvedValue([]);

      const result = await service.getProgress('new-user');

      expect(result).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update skill status to EXPLORING', async () => {
      const updated = { id: 'sp1', userId, skillId: 's1', status: 'EXPLORING' };
      mockRepo.upsertStatus.mockResolvedValue(updated as any);

      const result = await service.updateStatus(userId, 's1', 'EXPLORING');

      expect(result).toEqual(updated);
      expect(mockRepo.upsertStatus).toHaveBeenCalledWith(userId, 's1', 'EXPLORING');
    });

    it('should update skill status to LEARNED', async () => {
      const updated = { id: 'sp1', userId, skillId: 's1', status: 'LEARNED' };
      mockRepo.upsertStatus.mockResolvedValue(updated as any);

      const result = await service.updateStatus(userId, 's1', 'LEARNED');

      expect(result).toEqual(updated);
      expect(mockRepo.upsertStatus).toHaveBeenCalledWith(userId, 's1', 'LEARNED');
    });

    it('should update skill status to NOT_STARTED', async () => {
      const updated = { id: 'sp1', userId, skillId: 's1', status: 'NOT_STARTED' };
      mockRepo.upsertStatus.mockResolvedValue(updated as any);

      const result = await service.updateStatus(userId, 's1', 'NOT_STARTED');

      expect(result).toEqual(updated);
      expect(mockRepo.upsertStatus).toHaveBeenCalledWith(userId, 's1', 'NOT_STARTED');
    });
  });

  describe('getSummary', () => {
    it('should return summary stats with all status counts', async () => {
      const summary = { total: 10, NOT_STARTED: 3, EXPLORING: 4, LEARNED: 3 };
      mockRepo.getSummary.mockResolvedValue(summary as any);

      const result = await service.getSummary(userId);

      expect(result).toEqual(summary);
      expect(result.total).toBe(10);
      expect(mockRepo.getSummary).toHaveBeenCalledWith(userId);
    });

    it('should return zero counts for user with no skills', async () => {
      const summary = { total: 0, NOT_STARTED: 0, EXPLORING: 0, LEARNED: 0 };
      mockRepo.getSummary.mockResolvedValue(summary as any);

      const result = await service.getSummary('new-user');

      expect(result).toEqual(summary);
      expect(result.total).toBe(0);
    });
  });
});
