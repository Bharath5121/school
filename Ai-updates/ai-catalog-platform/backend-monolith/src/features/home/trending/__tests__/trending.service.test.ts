const mockGetTrending = jest.fn();
const mockGetWhatsNew = jest.fn();

jest.mock('../../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/trending.repository', () => ({
  TrendingRepository: jest.fn().mockImplementation(() => ({
    getTrending: mockGetTrending,
    getWhatsNew: mockGetWhatsNew,
  })),
}));

import { TrendingService } from '../services/trending.service';

describe('TrendingService', () => {
  let service: TrendingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TrendingService();
  });

  describe('getTrending', () => {
    it('delegates to repo with default params', async () => {
      mockGetTrending.mockResolvedValue([{ id: '1', title: 'GPT-5' }]);
      const result = await service.getTrending();
      expect(mockGetTrending).toHaveBeenCalledWith('today', 10);
      expect(result).toEqual([{ id: '1', title: 'GPT-5' }]);
    });

    it('passes custom timeframe and limit', async () => {
      mockGetTrending.mockResolvedValue([]);
      await service.getTrending('week', 5);
      expect(mockGetTrending).toHaveBeenCalledWith('week', 5);
    });

    it('returns empty array when no items', async () => {
      mockGetTrending.mockResolvedValue([]);
      const result = await service.getTrending();
      expect(result).toEqual([]);
    });
  });

  describe('getWhatsNew', () => {
    it('delegates with no filters', async () => {
      mockGetWhatsNew.mockResolvedValue({ models: [], agents: [] });
      const result = await service.getWhatsNew();
      expect(mockGetWhatsNew).toHaveBeenCalledWith(undefined, undefined, false);
      expect(result).toEqual({ models: [], agents: [] });
    });

    it('passes fieldSlugs filter', async () => {
      mockGetWhatsNew.mockResolvedValue({});
      await service.getWhatsNew(['ai-ml', 'robotics']);
      expect(mockGetWhatsNew).toHaveBeenCalledWith(['ai-ml', 'robotics'], undefined, false);
    });

    it('passes contentType filter', async () => {
      mockGetWhatsNew.mockResolvedValue({});
      await service.getWhatsNew(undefined, 'models');
      expect(mockGetWhatsNew).toHaveBeenCalledWith(undefined, 'models', false);
    });

    it('passes showAll flag', async () => {
      mockGetWhatsNew.mockResolvedValue({});
      await service.getWhatsNew(undefined, undefined, true);
      expect(mockGetWhatsNew).toHaveBeenCalledWith(undefined, undefined, true);
    });
  });
});
