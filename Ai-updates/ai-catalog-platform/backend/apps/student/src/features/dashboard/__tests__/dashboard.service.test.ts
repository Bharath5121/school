const mockAggregate = jest.fn();

jest.mock('../../../config/database', () => ({ prisma: {} }));
jest.mock('../services/dashboard-aggregator.service', () => ({
  DashboardAggregatorService: jest.fn().mockImplementation(() => ({
    aggregate: mockAggregate,
  })),
}));

import { DashboardService } from '../services/dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DashboardService();
  });

  describe('getOverview', () => {
    it('delegates to the aggregator and returns dashboard data', async () => {
      const dashboardData = {
        user: { name: 'Alice', interests: ['healthcare'], gradeLevel: '10th' },
        topStory: { id: 'f1', title: 'Top Story', field: 'healthcare', type: 'article', summary: 'Big news' },
        trending: [{ id: 't1', title: 'AI in Surgery', views: 100 }],
        fieldFeeds: { healthcare: [{ id: 'hc1', title: 'Health AI', contentType: 'article', fieldSlug: 'healthcare' }] },
        recentFeed: [{ id: 'f1', title: 'Top Story', type: 'article', field: 'healthcare' }],
      };
      mockAggregate.mockResolvedValue(dashboardData);

      const result = await service.getOverview('user-1');

      expect(mockAggregate).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(dashboardData);
    });

    it('returns empty state when aggregator returns defaults', async () => {
      const emptyData = {
        user: { name: 'Student', interests: [], gradeLevel: null },
        topStory: null,
        trending: [],
        fieldFeeds: {},
        recentFeed: [],
      };
      mockAggregate.mockResolvedValue(emptyData);

      const result = await service.getOverview('user-1');

      expect(result.user.name).toBe('Student');
      expect(result.topStory).toBeNull();
      expect(result.trending).toEqual([]);
    });

    it('passes correct userId to aggregator', async () => {
      mockAggregate.mockResolvedValue({
        user: { name: 'Bob', interests: [], gradeLevel: '8th' },
        topStory: null,
        trending: [],
        fieldFeeds: {},
        recentFeed: [],
      });

      await service.getOverview('user-42');

      expect(mockAggregate).toHaveBeenCalledWith('user-42');
    });

    it('propagates aggregator errors', async () => {
      mockAggregate.mockRejectedValue(new Error('DB failure'));

      await expect(service.getOverview('user-1')).rejects.toThrow('DB failure');
    });
  });
});
