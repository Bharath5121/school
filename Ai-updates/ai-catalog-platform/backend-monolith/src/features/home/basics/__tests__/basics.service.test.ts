import { AppError } from '../../../../shared/errors/AppError';

const mockGetAllTopics = jest.fn();
const mockGetTopicBySlug = jest.fn();
const mockGetTopicById = jest.fn();
const mockCreateTopic = jest.fn();
const mockUpdateTopic = jest.fn();
const mockDeleteTopic = jest.fn();

jest.mock('../../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/basics.repository', () => ({
  BasicsRepository: jest.fn().mockImplementation(() => ({
    getAllTopics: mockGetAllTopics,
    getTopicBySlug: mockGetTopicBySlug,
    getTopicById: mockGetTopicById,
    createTopic: mockCreateTopic,
    updateTopic: mockUpdateTopic,
    deleteTopic: mockDeleteTopic,
    createVideo: jest.fn(),
    updateVideo: jest.fn(),
    deleteVideo: jest.fn(),
    createArticle: jest.fn(),
    updateArticle: jest.fn(),
    deleteArticle: jest.fn(),
  })),
}));

import { BasicsService } from '../services/basics.service';

describe('BasicsService', () => {
  let service: BasicsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BasicsService();
  });

  describe('getAllTopics', () => {
    it('returns all topics', async () => {
      const topics = [{ id: '1', slug: 'what-is-ai', title: 'What is AI?' }];
      mockGetAllTopics.mockResolvedValue(topics);
      const result = await service.getAllTopics();
      expect(mockGetAllTopics).toHaveBeenCalled();
      expect(result).toEqual(topics);
    });

    it('returns empty array when no topics', async () => {
      mockGetAllTopics.mockResolvedValue([]);
      const result = await service.getAllTopics();
      expect(result).toEqual([]);
    });
  });

  describe('getTopicBySlug', () => {
    it('returns topic when found', async () => {
      const topic = { id: '1', slug: 'what-is-ai', title: 'What is AI?' };
      mockGetTopicBySlug.mockResolvedValue(topic);
      const result = await service.getTopicBySlug('what-is-ai');
      expect(mockGetTopicBySlug).toHaveBeenCalledWith('what-is-ai');
      expect(result).toEqual(topic);
    });

    it('throws 404 when not found', async () => {
      mockGetTopicBySlug.mockResolvedValue(null);
      await expect(service.getTopicBySlug('non-existent')).rejects.toThrow(AppError);
      await expect(service.getTopicBySlug('non-existent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Topic not found',
      });
    });
  });

  describe('getTopicById', () => {
    it('returns topic when found', async () => {
      const topic = { id: 'uuid-1', slug: 'ai-basics' };
      mockGetTopicById.mockResolvedValue(topic);
      const result = await service.getTopicById('uuid-1');
      expect(result).toEqual(topic);
    });

    it('throws 404 when not found', async () => {
      mockGetTopicById.mockResolvedValue(null);
      await expect(service.getTopicById('missing')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('createTopic', () => {
    it('delegates to repository', async () => {
      const data = { slug: 'new', title: 'New Topic' };
      mockCreateTopic.mockResolvedValue({ id: 'new-id', ...data });
      const result = await service.createTopic(data);
      expect(mockCreateTopic).toHaveBeenCalledWith(data);
      expect(result.id).toBe('new-id');
    });
  });

  describe('updateTopic', () => {
    it('updates when topic exists', async () => {
      mockGetTopicById.mockResolvedValue({ id: 'uuid-1' });
      mockUpdateTopic.mockResolvedValue({ id: 'uuid-1', title: 'Updated' });
      const result = await service.updateTopic('uuid-1', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });

    it('throws 404 when topic not found', async () => {
      mockGetTopicById.mockResolvedValue(null);
      await expect(service.updateTopic('missing', {})).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteTopic', () => {
    it('deletes when topic exists', async () => {
      mockGetTopicById.mockResolvedValue({ id: 'uuid-1' });
      mockDeleteTopic.mockResolvedValue({ id: 'uuid-1' });
      await service.deleteTopic('uuid-1');
      expect(mockDeleteTopic).toHaveBeenCalledWith('uuid-1');
    });

    it('throws 404 when topic not found', async () => {
      mockGetTopicById.mockResolvedValue(null);
      await expect(service.deleteTopic('missing')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
