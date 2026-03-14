import { HistoryService } from '../services/history.service';
import { HistoryRepository } from '../repositories/history.repository';

jest.mock('../repositories/history.repository');

const mockRepo = HistoryRepository.prototype as jest.Mocked<HistoryRepository>;

describe('HistoryService', () => {
  let service: HistoryService;
  const userId = 'user-123';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HistoryService();
  });

  describe('list', () => {
    const historyData = {
      items: [
        { id: 'h1', userId, feedItem: { id: 'f1', title: 'AI Update', contentType: 'MODEL' } },
      ],
      total: 1,
    };

    it('should return history without time filtering', async () => {
      mockRepo.findByUser.mockResolvedValue(historyData as any);

      const result = await service.list(userId, 1, 10);

      expect(result).toEqual(historyData);
      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId, 1, 10, undefined);
    });

    it('should filter by "today" timeframe', async () => {
      mockRepo.findByUser.mockResolvedValue(historyData as any);

      await service.list(userId, 1, 10, 'today');

      const call = mockRepo.findByUser.mock.calls[0];
      expect(call[0]).toBe(userId);
      expect(call[3]).toBeInstanceOf(Date);
      const sinceDate = call[3] as Date;
      expect(sinceDate.getHours()).toBe(0);
      expect(sinceDate.getMinutes()).toBe(0);
    });

    it('should filter by "week" timeframe', async () => {
      mockRepo.findByUser.mockResolvedValue(historyData as any);
      const now = Date.now();

      await service.list(userId, 1, 10, 'week');

      const call = mockRepo.findByUser.mock.calls[0];
      const sinceDate = call[3] as Date;
      const diff = now - sinceDate.getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      expect(diff).toBeGreaterThanOrEqual(sevenDaysMs - 1000);
      expect(diff).toBeLessThanOrEqual(sevenDaysMs + 1000);
    });

    it('should filter by "month" timeframe', async () => {
      mockRepo.findByUser.mockResolvedValue(historyData as any);
      const now = Date.now();

      await service.list(userId, 1, 10, 'month');

      const call = mockRepo.findByUser.mock.calls[0];
      const sinceDate = call[3] as Date;
      const diff = now - sinceDate.getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      expect(diff).toBeGreaterThanOrEqual(thirtyDaysMs - 1000);
      expect(diff).toBeLessThanOrEqual(thirtyDaysMs + 1000);
    });

    it('should not set since for unknown timeframe', async () => {
      mockRepo.findByUser.mockResolvedValue(historyData as any);

      await service.list(userId, 1, 10, 'year');

      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId, 1, 10, undefined);
    });
  });

  describe('track', () => {
    it('should record reading history', async () => {
      const entry = { id: 'h1', userId, feedItemId: 'f1', timeSpentSeconds: 120, lastReadAt: new Date() };
      mockRepo.upsert.mockResolvedValue(entry as any);

      const result = await service.track(userId, 'f1', 120);

      expect(result).toEqual(entry);
      expect(mockRepo.upsert).toHaveBeenCalledWith(userId, 'f1', 120);
    });

    it('should handle zero time spent', async () => {
      const entry = { id: 'h1', userId, feedItemId: 'f1', timeSpentSeconds: 0 };
      mockRepo.upsert.mockResolvedValue(entry as any);

      const result = await service.track(userId, 'f1', 0);

      expect(result).toEqual(entry);
      expect(mockRepo.upsert).toHaveBeenCalledWith(userId, 'f1', 0);
    });
  });

  describe('stats', () => {
    it('should return reading stats for a user', async () => {
      const stats = {
        itemsThisWeek: 15,
        totalTimeSeconds: 3600,
        mostExplored: [{ field: 'healthcare', count: 8 }],
      };
      mockRepo.getStats.mockResolvedValue(stats as any);

      const result = await service.stats(userId);

      expect(result).toEqual(stats);
      expect(mockRepo.getStats).toHaveBeenCalledWith(userId);
    });

    it('should return zero stats for inactive user', async () => {
      const stats = { itemsThisWeek: 0, totalTimeSeconds: 0, mostExplored: [] };
      mockRepo.getStats.mockResolvedValue(stats as any);

      const result = await service.stats('inactive-user');

      expect(result).toEqual(stats);
    });
  });

  describe('clear', () => {
    it('should clear all history for a user', async () => {
      const deleteResult = { count: 25 };
      mockRepo.clearAll.mockResolvedValue(deleteResult as any);

      const result = await service.clear(userId);

      expect(result).toEqual(deleteResult);
      expect(mockRepo.clearAll).toHaveBeenCalledWith(userId);
    });

    it('should handle clearing when no history exists', async () => {
      mockRepo.clearAll.mockResolvedValue({ count: 0 } as any);

      const result = await service.clear(userId);

      expect(result).toEqual({ count: 0 });
    });
  });
});
