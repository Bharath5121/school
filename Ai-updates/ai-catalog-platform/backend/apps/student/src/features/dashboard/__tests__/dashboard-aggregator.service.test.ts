const mockGetUser = jest.fn();
const mockGetTrending = jest.fn();
const mockGetRecentFeed = jest.fn();
const mockGetFieldFeed = jest.fn();

jest.mock('../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/dashboard.repository', () => ({
  DashboardRepository: jest.fn().mockImplementation(() => ({
    getUser: mockGetUser,
    getTrending: mockGetTrending,
    getRecentFeed: mockGetRecentFeed,
    getFieldFeed: mockGetFieldFeed,
  })),
}));

import { DashboardAggregatorService } from '../services/dashboard-aggregator.service';

describe('DashboardAggregatorService', () => {
  let service: DashboardAggregatorService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DashboardAggregatorService();
  });

  const userId = 'user-1';

  it('returns aggregated homepage data with field feeds', async () => {
    const mockUser = {
      name: 'Alice',
      profile: {
        gradeLevel: '10th',
        interests: [{ fieldName: 'healthcare' }, { fieldName: 'finance' }],
      },
    };
    const mockTrending = [
      { id: 't1', title: 'AI in Surgery', views: 100 },
      { id: 't2', title: 'GPT-5 Launch', views: 80 },
    ];
    const mockRecentFeed = [
      {
        id: 'f1',
        title: 'Top Story',
        contentType: 'article',
        fieldSlug: 'healthcare',
        summary: 'Big news',
        careerImpactText: 'High impact',
        publishedAt: new Date(),
      },
    ];
    mockGetUser.mockResolvedValue(mockUser);
    mockGetTrending.mockResolvedValue(mockTrending);
    mockGetRecentFeed.mockResolvedValue(mockRecentFeed);
    mockGetFieldFeed
      .mockResolvedValueOnce([{ id: 'hc1', title: 'Health AI', contentType: 'article', fieldSlug: 'healthcare' }])
      .mockResolvedValueOnce([]);

    const result = await service.aggregate(userId);

    expect(result.user).toEqual({ name: 'Alice', interests: ['healthcare', 'finance'], gradeLevel: '10th' });
    expect(result.trending).toHaveLength(2);
    expect(result.topStory).toMatchObject({ id: 'f1', title: 'Top Story', field: 'healthcare' });
    expect(result.fieldFeeds.healthcare).toHaveLength(1);
    expect(result.fieldFeeds.finance).toBeUndefined();
  });

  it('returns empty state when user has no profile', async () => {
    mockGetUser.mockResolvedValue(null);
    mockGetTrending.mockResolvedValue([]);
    mockGetRecentFeed.mockResolvedValue([]);

    const result = await service.aggregate(userId);

    expect(result.user).toEqual({ name: 'Student', interests: [], gradeLevel: null });
    expect(result.topStory).toBeNull();
    expect(result.trending).toEqual([]);
    expect(result.recentFeed).toEqual([]);
    expect(result.fieldFeeds).toEqual({});
  });

  it('skips field feeds when interest returns no items', async () => {
    mockGetUser.mockResolvedValue({
      name: 'Charlie',
      profile: { gradeLevel: null, interests: [{ fieldName: 'robotics' }] },
    });
    mockGetTrending.mockResolvedValue([]);
    mockGetRecentFeed.mockResolvedValue([]);
    mockGetFieldFeed.mockResolvedValue([]);

    const result = await service.aggregate(userId);

    expect(result.fieldFeeds).toEqual({});
    expect(result.user.interests).toEqual(['robotics']);
  });
});
