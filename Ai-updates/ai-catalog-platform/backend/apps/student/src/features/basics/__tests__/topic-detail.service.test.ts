import { AppError } from '../../../shared/errors/AppError';

const mockFindBySlug = jest.fn();
const mockFindById = jest.fn();
const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();

jest.mock('../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/topic-detail.repository', () => ({
  TopicDetailRepository: jest.fn().mockImplementation(() => ({
    findBySlug: mockFindBySlug,
    findById: mockFindById,
  })),
}));
jest.mock('../../../shared/utils/cache', () => ({
  cacheGet: mockCacheGet,
  cacheSet: mockCacheSet,
}));

import { TopicDetailService } from '../services/topic-detail.service';
import { BasicsCacheKeys, BasicsCacheTTL } from '../cache/basics.cache';

describe('TopicDetailService', () => {
  let service: TopicDetailService;

  const mockTopic = {
    id: '1',
    slug: 'what-is-ai',
    title: 'What is AI?',
    tagline: 'Introduction to AI',
    description: 'A comprehensive guide',
    icon: 'brain',
    color: '#6366f1',
    sortOrder: 1,
    concepts: ['Neural Networks', 'Deep Learning'],
    videos: [{ id: 'v1', title: 'AI Intro', url: 'https://example.com', sortOrder: 1, topicId: '1' }],
    articles: [{ id: 'a1', title: 'AI Article', url: 'https://example.com', sortOrder: 1, topicId: '1' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TopicDetailService();
  });

  describe('getTopicBySlug', () => {
    it('returns topic from repository on cache miss', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockFindBySlug.mockResolvedValue(mockTopic);

      const result = await service.getTopicBySlug('what-is-ai');

      expect(mockCacheGet).toHaveBeenCalledWith(BasicsCacheKeys.topicBySlug('what-is-ai'));
      expect(mockFindBySlug).toHaveBeenCalledWith('what-is-ai');
      expect(mockCacheSet).toHaveBeenCalledWith(
        BasicsCacheKeys.topicBySlug('what-is-ai'),
        mockTopic,
        BasicsCacheTTL.TOPIC_DETAIL,
      );
      expect(result).toEqual(mockTopic);
    });

    it('returns topic from cache on cache hit', async () => {
      mockCacheGet.mockResolvedValue(mockTopic);

      const result = await service.getTopicBySlug('what-is-ai');

      expect(mockCacheGet).toHaveBeenCalledWith(BasicsCacheKeys.topicBySlug('what-is-ai'));
      expect(mockFindBySlug).not.toHaveBeenCalled();
      expect(result).toEqual(mockTopic);
    });

    it('throws 404 when topic not found', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockFindBySlug.mockResolvedValue(null);

      await expect(service.getTopicBySlug('non-existent')).rejects.toThrow(AppError);
      await expect(service.getTopicBySlug('non-existent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Topic not found',
      });
      expect(mockCacheSet).not.toHaveBeenCalled();
    });

    it('propagates repository errors', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockFindBySlug.mockRejectedValue(new Error('DB error'));

      await expect(service.getTopicBySlug('what-is-ai')).rejects.toThrow('DB error');
    });
  });

  describe('getTopicById', () => {
    it('returns topic by id from repository on cache miss', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockFindById.mockResolvedValue(mockTopic);

      const result = await service.getTopicById('1');

      expect(mockCacheGet).toHaveBeenCalledWith(BasicsCacheKeys.topicById('1'));
      expect(mockFindById).toHaveBeenCalledWith('1');
      expect(mockCacheSet).toHaveBeenCalledWith(
        BasicsCacheKeys.topicById('1'),
        mockTopic,
        BasicsCacheTTL.TOPIC_DETAIL,
      );
      expect(result).toEqual(mockTopic);
    });

    it('throws 404 when topic not found by id', async () => {
      mockCacheGet.mockResolvedValue(null);
      mockFindById.mockResolvedValue(null);

      await expect(service.getTopicById('missing-id')).rejects.toThrow(AppError);
      await expect(service.getTopicById('missing-id')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Topic not found',
      });
    });
  });
});
