const mockFindAll = jest.fn();
const mockCount = jest.fn();
const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();

jest.mock('../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/topic.repository', () => ({
  TopicRepository: jest.fn().mockImplementation(() => ({
    findAll: mockFindAll,
    count: mockCount,
  })),
}));
jest.mock('../../../shared/utils/cache', () => ({
  cacheGet: mockCacheGet,
  cacheSet: mockCacheSet,
}));

import { TopicService } from '../services/topic.service';
import { BasicsCacheKeys, BasicsCacheTTL } from '../cache/basics.cache';

describe('TopicService', () => {
  let service: TopicService;

  const mockTopics = [
    { id: '1', slug: 'what-is-ai', title: 'What is AI?', tagline: 'Intro', icon: 'brain', color: '#000', sortOrder: 1 },
    { id: '2', slug: 'ml-basics', title: 'ML Basics', tagline: 'Learn ML', icon: 'chart', color: '#111', sortOrder: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TopicService();
  });

  it('returns all topics from repository on cache miss', async () => {
    mockCacheGet.mockResolvedValue(null);
    mockFindAll.mockResolvedValue(mockTopics);

    const result = await service.getAllTopics();

    expect(mockCacheGet).toHaveBeenCalledWith(BasicsCacheKeys.topics());
    expect(mockFindAll).toHaveBeenCalled();
    expect(mockCacheSet).toHaveBeenCalledWith(
      BasicsCacheKeys.topics(),
      mockTopics,
      BasicsCacheTTL.TOPICS_LIST,
    );
    expect(result).toEqual(mockTopics);
  });

  it('returns topics from cache on cache hit', async () => {
    mockCacheGet.mockResolvedValue(mockTopics);

    const result = await service.getAllTopics();

    expect(mockCacheGet).toHaveBeenCalledWith(BasicsCacheKeys.topics());
    expect(mockFindAll).not.toHaveBeenCalled();
    expect(mockCacheSet).not.toHaveBeenCalled();
    expect(result).toEqual(mockTopics);
  });

  it('returns empty array when no topics exist', async () => {
    mockCacheGet.mockResolvedValue(null);
    mockFindAll.mockResolvedValue([]);

    const result = await service.getAllTopics();

    expect(result).toEqual([]);
    expect(mockCacheSet).toHaveBeenCalledWith(
      BasicsCacheKeys.topics(),
      [],
      BasicsCacheTTL.TOPICS_LIST,
    );
  });

  it('still fetches from repository when cacheGet throws', async () => {
    mockCacheGet.mockRejectedValue(new Error('Redis down'));
    mockFindAll.mockResolvedValue(mockTopics);

    await expect(service.getAllTopics()).rejects.toThrow('Redis down');
  });

  it('propagates repository errors', async () => {
    mockCacheGet.mockResolvedValue(null);
    mockFindAll.mockRejectedValue(new Error('DB connection failed'));

    await expect(service.getAllTopics()).rejects.toThrow('DB connection failed');
    expect(mockCacheSet).not.toHaveBeenCalled();
  });
});
