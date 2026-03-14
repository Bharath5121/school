import { CareerService } from '../services/career.service';
import { CareerRepository } from '../repositories/career.repository';

jest.mock('../repositories/career.repository');

const mockRepo = CareerRepository.prototype as jest.Mocked<CareerRepository>;

describe('CareerService', () => {
  let service: CareerService;
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CareerService();
  });

  describe('getExplored', () => {
    it('should return explored careers for a user', async () => {
      const explored = [
        { id: 'e1', userId, careerJobId: 'j1', exploredAt: new Date('2025-01-15') },
        { id: 'e2', userId, careerJobId: 'j2', exploredAt: new Date('2025-01-10') },
      ];
      mockRepo.getExploredByUser.mockResolvedValue(explored as any);

      const result = await service.getExplored(userId);

      expect(result).toEqual(explored);
      expect(result).toHaveLength(2);
      expect(mockRepo.getExploredByUser).toHaveBeenCalledWith(userId);
    });

    it('should return empty array for user with no explored careers', async () => {
      mockRepo.getExploredByUser.mockResolvedValue([]);

      const result = await service.getExplored('new-user');

      expect(result).toEqual([]);
    });
  });

  describe('markExplored', () => {
    it('should mark a career job as explored', async () => {
      const entry = { id: 'e1', userId, careerJobId: 'j1', exploredAt: new Date() };
      mockRepo.markExplored.mockResolvedValue(entry as any);

      const result = await service.markExplored(userId, 'j1');

      expect(result).toEqual(entry);
      expect(mockRepo.markExplored).toHaveBeenCalledWith(userId, 'j1');
    });

    it('should update exploredAt when marking an already-explored career', async () => {
      const updatedEntry = { id: 'e1', userId, careerJobId: 'j1', exploredAt: new Date() };
      mockRepo.markExplored.mockResolvedValue(updatedEntry as any);

      const result = await service.markExplored(userId, 'j1');

      expect(result.exploredAt).toBeDefined();
      expect(mockRepo.markExplored).toHaveBeenCalledWith(userId, 'j1');
    });
  });

  describe('getStats', () => {
    it('should return career exploration stats', async () => {
      const stats = { totalExplored: 5, jobIds: ['j1', 'j2', 'j3', 'j4', 'j5'] };
      mockRepo.getStats.mockResolvedValue(stats as any);

      const result = await service.getStats(userId);

      expect(result).toEqual(stats);
      expect(result.totalExplored).toBe(5);
      expect(result.jobIds).toHaveLength(5);
      expect(mockRepo.getStats).toHaveBeenCalledWith(userId);
    });

    it('should return zero stats for user with no exploration', async () => {
      const stats = { totalExplored: 0, jobIds: [] };
      mockRepo.getStats.mockResolvedValue(stats as any);

      const result = await service.getStats('new-user');

      expect(result.totalExplored).toBe(0);
      expect(result.jobIds).toEqual([]);
    });
  });
});
