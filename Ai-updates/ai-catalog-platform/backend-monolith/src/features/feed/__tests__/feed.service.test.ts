import { AppError } from '../../../shared/errors/AppError';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockFindById = jest.fn();
const mockFindMany = jest.fn();
const mockGetTrending = jest.fn();
const mockGetDistinctFields = jest.fn();

jest.mock('../../../config/redis', () => ({
  redis: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
}));
jest.mock('../../../config/database', () => ({ prisma: {} }));
jest.mock('../repositories/feed.repository', () => ({
  FeedRepository: jest.fn().mockImplementation(() => ({
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    findById: mockFindById,
    findMany: mockFindMany,
    getTrending: mockGetTrending,
    getDistinctFields: mockGetDistinctFields,
  })),
}));

import { FeedService } from '../services/feed.service';

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FeedService();
  });

  describe('createItem', () => {
    it('creates a feed item', async () => {
      const dto = {
        title: 'GPT-5 Released',
        summary: 'OpenAI releases GPT-5',
        content: '<p>Article</p>',
        contentType: 'MODEL',
        fieldSlug: 'ai-ml',
        metadata: { source: 'openai.com' },
      };
      mockCreate.mockResolvedValue({ id: 'uuid-1', ...dto });
      const result = await service.createItem(dto);
      expect(mockCreate).toHaveBeenCalled();
      expect(result.id).toBe('uuid-1');
    });

    it('defaults metadata to empty object', async () => {
      const dto = { title: 'T', summary: 'S', contentType: 'AGENT', fieldSlug: 'ai' };
      mockCreate.mockResolvedValue({ id: '2', ...dto, metadata: {} });
      await service.createItem(dto);
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ metadata: {} }));
    });
  });

  describe('updateItem', () => {
    it('updates existing item', async () => {
      mockFindById.mockResolvedValue({ id: 'uuid-1', title: 'Old' });
      mockUpdate.mockResolvedValue({ id: 'uuid-1', title: 'New' });
      const result = await service.updateItem('uuid-1', { title: 'New' });
      expect(mockFindById).toHaveBeenCalledWith('uuid-1');
      expect(result.title).toBe('New');
    });

    it('throws 404 when not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.updateItem('missing', {})).rejects.toMatchObject({
        statusCode: 404,
        message: 'Feed item not found',
      });
    });
  });

  describe('deleteItem', () => {
    it('deletes existing item', async () => {
      mockFindById.mockResolvedValue({ id: 'uuid-1' });
      mockDelete.mockResolvedValue(undefined);
      await service.deleteItem('uuid-1');
      expect(mockDelete).toHaveBeenCalledWith('uuid-1');
    });

    it('throws 404 when not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.deleteItem('missing')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('getItem', () => {
    it('returns item when found', async () => {
      mockFindById.mockResolvedValue({ id: 'uuid-1', title: 'AI Trends' });
      const result = await service.getItem('uuid-1');
      expect(result.title).toBe('AI Trends');
    });

    it('throws 404 when not found', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(service.getItem('missing')).rejects.toThrow(AppError);
    });
  });

  describe('getFeed', () => {
    it('returns paginated results with defaults', async () => {
      mockFindMany.mockResolvedValue({ items: [{ id: '1' }], total: 42 });
      const result = await service.getFeed({});
      expect(mockFindMany).toHaveBeenCalledWith({}, 0, 20);
      expect(result).toEqual({ data: [{ id: '1' }], total: 42, page: 1, limit: 20 });
    });

    it('applies page and limit', async () => {
      mockFindMany.mockResolvedValue({ items: [], total: 0 });
      await service.getFeed({ page: 3 as any, limit: 5 as any });
      expect(mockFindMany).toHaveBeenCalledWith({}, 10, 5);
    });

    it('filters by fieldSlug', async () => {
      mockFindMany.mockResolvedValue({ items: [], total: 0 });
      await service.getFeed({ fieldSlug: 'ai-ml' });
      expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ fieldSlug: 'ai-ml' }), 0, 20);
    });

    it('builds search OR clause', async () => {
      mockFindMany.mockResolvedValue({ items: [], total: 0 });
      await service.getFeed({ search: 'GPT' });
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          OR: [
            { title: { contains: 'GPT', mode: 'insensitive' } },
            { summary: { contains: 'GPT', mode: 'insensitive' } },
          ],
        }),
        0, 20,
      );
    });
  });

  describe('getTrending', () => {
    it('returns trending items', async () => {
      mockGetTrending.mockResolvedValue([{ id: '1', views: 100 }]);
      const result = await service.getTrending();
      expect(mockGetTrending).toHaveBeenCalledWith(10);
      expect(result).toHaveLength(1);
    });
  });

  describe('getFields', () => {
    it('returns distinct fields', async () => {
      mockGetDistinctFields.mockResolvedValue([{ slug: 'ai-ml', name: 'ai-ml' }]);
      const result = await service.getFields();
      expect(result).toHaveLength(1);
    });
  });
});
