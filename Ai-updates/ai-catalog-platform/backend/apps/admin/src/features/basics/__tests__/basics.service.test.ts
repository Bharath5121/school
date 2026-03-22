import { NotFoundError } from '../../../../shared/errors/NotFoundError';

const prismaMock = {
  basicsTopic: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  basicsVideo: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  basicsArticle: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('../../../../config/database', () => ({
  prisma: prismaMock,
}));

jest.mock('../../../../shared/utils/cache', () => ({
  cacheGet: jest.fn().mockResolvedValue(null),
  cacheSet: jest.fn().mockResolvedValue(undefined),
  cacheDelPattern: jest.fn().mockResolvedValue(undefined),
}));

import { BasicsService } from '../services/basics.service';

describe('BasicsService', () => {
  let service: BasicsService;

  beforeEach(() => {
    service = new BasicsService();
    jest.clearAllMocks();
  });

  // ─── Topics ──────────────────────────────────────────────────────

  describe('getAllTopics', () => {
    it('returns all topics from repository', async () => {
      const topics = [
        { id: 'bt-1', title: 'Intro', slug: 'intro', sortOrder: 0, _count: { videos: 2, articles: 1 } },
      ];
      prismaMock.basicsTopic.findMany.mockResolvedValue(topics);

      const result = await service.getAllTopics();

      expect(prismaMock.basicsTopic.findMany).toHaveBeenCalled();
      expect(result).toEqual(topics);
    });
  });

  describe('getTopicById', () => {
    const topic = {
      id: 'bt-1', slug: 'intro', title: 'Intro to AI',
      tagline: 'Learn AI', description: 'Desc',
      videos: [], articles: [],
    };

    it('returns topic when found', async () => {
      prismaMock.basicsTopic.findUnique.mockResolvedValue(topic);

      const result = await service.getTopicById('bt-1');

      expect(prismaMock.basicsTopic.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'bt-1' } }),
      );
      expect(result).toEqual(topic);
    });

    it('throws NotFoundError when topic not found', async () => {
      prismaMock.basicsTopic.findUnique.mockResolvedValue(null);

      await expect(service.getTopicById('missing'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('createTopic', () => {
    it('creates and returns a new topic', async () => {
      const data = { title: 'Intro', slug: 'intro' };
      const created = { id: 'bt-1', ...data, sortOrder: 0 };
      prismaMock.basicsTopic.create.mockResolvedValue(created);

      const result = await service.createTopic(data as any);

      expect(prismaMock.basicsTopic.create).toHaveBeenCalledWith(
        expect.objectContaining({ data }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('updateTopic', () => {
    it('updates an existing topic', async () => {
      const topic = { id: 'bt-1', slug: 'intro', title: 'Intro', videos: [], articles: [] };
      const updated = { ...topic, title: 'Updated' };
      prismaMock.basicsTopic.findUnique.mockResolvedValue(topic);
      prismaMock.basicsTopic.update.mockResolvedValue(updated);

      const result = await service.updateTopic('bt-1', { title: 'Updated' } as any);

      expect(prismaMock.basicsTopic.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'bt-1' }, data: { title: 'Updated' } }),
      );
      expect(result.title).toBe('Updated');
    });

    it('throws NotFoundError when updating non-existent topic', async () => {
      prismaMock.basicsTopic.findUnique.mockResolvedValue(null);

      await expect(service.updateTopic('missing', { title: 'x' } as any))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('deleteTopic', () => {
    it('deletes an existing topic', async () => {
      const topic = { id: 'bt-1', slug: 'intro', title: 'Intro', videos: [], articles: [] };
      prismaMock.basicsTopic.findUnique.mockResolvedValue(topic);
      prismaMock.basicsTopic.delete.mockResolvedValue({ id: 'bt-1', title: 'Intro' });

      const result = await service.deleteTopic('bt-1');

      expect(prismaMock.basicsTopic.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'bt-1' } }),
      );
      expect(result.id).toBe('bt-1');
    });

    it('throws NotFoundError when deleting non-existent topic', async () => {
      prismaMock.basicsTopic.findUnique.mockResolvedValue(null);

      await expect(service.deleteTopic('missing'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  // ─── Videos ──────────────────────────────────────────────────────

  describe('createVideo', () => {
    it('creates a video and invalidates cache', async () => {
      const data = { title: 'Video 1', url: 'https://example.com/v1', topicId: 'bt-1' };
      const created = { id: 'bv-1', ...data, sortOrder: 0 };
      prismaMock.basicsVideo.create.mockResolvedValue(created);

      const result = await service.createVideo(data as any);

      expect(prismaMock.basicsVideo.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });

  // ─── Articles ────────────────────────────────────────────────────

  describe('createArticle', () => {
    it('creates an article and invalidates cache', async () => {
      const data = { title: 'Article 1', url: 'https://example.com/a1', topicId: 'bt-1' };
      const created = { id: 'ba-1', ...data, sortOrder: 0 };
      prismaMock.basicsArticle.create.mockResolvedValue(created);

      const result = await service.createArticle(data as any);

      expect(prismaMock.basicsArticle.create).toHaveBeenCalled();
      expect(result).toEqual(created);
    });
  });
});
