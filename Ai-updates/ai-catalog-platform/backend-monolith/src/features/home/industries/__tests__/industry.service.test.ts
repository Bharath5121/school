import { IndustryService } from '../services/industry.service';
import { IndustryRepository } from '../repositories/industry.repository';
import { redis } from '../../../../config/redis';

jest.mock('../repositories/industry.repository');
jest.mock('../../../../config/redis', () => ({
  redis: { get: jest.fn(), setex: jest.fn() },
}));
jest.mock('../../../../shared/logger/logger', () => ({
  __esModule: true,
  default: { error: jest.fn(), info: jest.fn() },
}));

const mockRedis = redis as jest.Mocked<typeof redis>;
const mockRepo = IndustryRepository.prototype as jest.Mocked<IndustryRepository>;

describe('IndustryService', () => {
  let service: IndustryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new IndustryService();
  });

  describe('listIndustries', () => {
    const industries = [
      { id: '1', name: 'Healthcare', slug: 'healthcare', isActive: true, sortOrder: 1 },
      { id: '2', name: 'Finance', slug: 'finance', isActive: true, sortOrder: 2 },
    ];

    it('should return cached industries when cache hit', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(industries));

      const result = await service.listIndustries();

      expect(result).toEqual(industries);
      expect(mockRedis.get).toHaveBeenCalledWith('home:industries');
      expect(mockRepo.getAllActive).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRepo.getAllActive.mockResolvedValue(industries as any);
      mockRedis.setex.mockResolvedValue('OK');

      const result = await service.listIndustries();

      expect(result).toEqual(industries);
      expect(mockRepo.getAllActive).toHaveBeenCalled();
      expect(mockRedis.setex).toHaveBeenCalledWith('home:industries', 1800, JSON.stringify(industries));
    });

    it('should fallback to DB when Redis throws', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis down'));
      mockRepo.getAllActive.mockResolvedValue(industries as any);

      const result = await service.listIndustries();

      expect(result).toEqual(industries);
      expect(mockRepo.getAllActive).toHaveBeenCalled();
    });
  });

  describe('getIndustryMetadata', () => {
    it('should return industry for a valid slug', async () => {
      const industry = { id: '1', name: 'Healthcare', slug: 'healthcare' };
      mockRepo.getBySlug.mockResolvedValue(industry as any);

      const result = await service.getIndustryMetadata('healthcare');

      expect(result).toEqual(industry);
      expect(mockRepo.getBySlug).toHaveBeenCalledWith('healthcare');
    });

    it('should return null for a non-existent slug', async () => {
      mockRepo.getBySlug.mockResolvedValue(null);

      const result = await service.getIndustryMetadata('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    const stats = { totalModels: 50, totalFields: 10, updatesToday: 5 };

    it('should return cached stats when cache hit', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(stats));

      const result = await service.getStats();

      expect(result).toEqual(stats);
      expect(mockRedis.get).toHaveBeenCalledWith('home:stats');
      expect(mockRepo.getPlatformStats).not.toHaveBeenCalled();
    });

    it('should fetch from DB and cache when cache miss', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRepo.getPlatformStats.mockResolvedValue(stats as any);
      mockRedis.setex.mockResolvedValue('OK');

      const result = await service.getStats();

      expect(result).toEqual(stats);
      expect(mockRepo.getPlatformStats).toHaveBeenCalled();
      expect(mockRedis.setex).toHaveBeenCalledWith('home:stats', 300, JSON.stringify(stats));
    });

    it('should fallback to DB when Redis throws', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis down'));
      mockRepo.getPlatformStats.mockResolvedValue(stats as any);

      const result = await service.getStats();

      expect(result).toEqual(stats);
    });
  });

  describe('getFieldStats', () => {
    it('should delegate to repository with slug array', async () => {
      const fieldStats = [{ name: 'Healthcare', slug: 'healthcare', _count: { models: 10 } }];
      mockRepo.getFieldStats.mockResolvedValue(fieldStats as any);

      const result = await service.getFieldStats(['healthcare', 'finance']);

      expect(result).toEqual(fieldStats);
      expect(mockRepo.getFieldStats).toHaveBeenCalledWith(['healthcare', 'finance']);
    });
  });

  describe('getLatestByField', () => {
    it('should delegate to repository with slug and default take', async () => {
      const latest = { models: [], agents: [], apps: [] };
      mockRepo.getLatestByField.mockResolvedValue(latest as any);

      const result = await service.getLatestByField('healthcare');

      expect(result).toEqual(latest);
      expect(mockRepo.getLatestByField).toHaveBeenCalledWith('healthcare', 3);
    });
  });
});
