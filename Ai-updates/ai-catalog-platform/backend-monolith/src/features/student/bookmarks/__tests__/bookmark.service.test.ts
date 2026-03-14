import { BookmarkService } from '../services/bookmark.service';
import { BookmarkRepository } from '../repositories/bookmark.repository';
import { AppError } from '../../../../shared/errors/AppError';

jest.mock('../repositories/bookmark.repository');

const mockRepo = BookmarkRepository.prototype as jest.Mocked<BookmarkRepository>;

describe('BookmarkService', () => {
  let service: BookmarkService;
  const userId = 'user-123';
  const feedItemId = 'feed-456';

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookmarkService();
  });

  describe('list', () => {
    it('should return paginated bookmarks for a user', async () => {
      const data = {
        items: [
          { id: 'b1', userId, feedItem: { id: feedItemId, title: 'AI Article', contentType: 'MODEL' } },
        ],
        total: 1,
      };
      mockRepo.findByUser.mockResolvedValue(data as any);

      const result = await service.list(userId, 1, 10);

      expect(result).toEqual(data);
      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId, 1, 10, undefined);
    });

    it('should filter by content type when provided', async () => {
      const data = { items: [], total: 0 };
      mockRepo.findByUser.mockResolvedValue(data as any);

      await service.list(userId, 1, 10, 'MODEL');

      expect(mockRepo.findByUser).toHaveBeenCalledWith(userId, 1, 10, 'MODEL');
    });

    it('should return empty results for user with no bookmarks', async () => {
      const data = { items: [], total: 0 };
      mockRepo.findByUser.mockResolvedValue(data as any);

      const result = await service.list(userId, 1, 10);

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('add', () => {
    it('should create a bookmark when it does not already exist', async () => {
      const bookmark = { id: 'b1', userId, feedItemId, feedItem: { id: feedItemId, title: 'AI Article' } };
      mockRepo.exists.mockResolvedValue(false);
      mockRepo.create.mockResolvedValue(bookmark as any);

      const result = await service.add(userId, feedItemId);

      expect(result).toEqual(bookmark);
      expect(mockRepo.exists).toHaveBeenCalledWith(userId, feedItemId);
      expect(mockRepo.create).toHaveBeenCalledWith(userId, feedItemId);
    });

    it('should throw 409 when item is already bookmarked', async () => {
      mockRepo.exists.mockResolvedValue(true);

      await expect(service.add(userId, feedItemId)).rejects.toThrow(AppError);
      await expect(service.add(userId, feedItemId)).rejects.toMatchObject({
        message: 'Item already bookmarked',
        statusCode: 409,
      });
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a bookmark when it exists', async () => {
      const deleted = { id: 'b1', userId, feedItemId };
      mockRepo.exists.mockResolvedValue(true);
      mockRepo.delete.mockResolvedValue(deleted as any);

      const result = await service.remove(userId, feedItemId);

      expect(result).toEqual(deleted);
      expect(mockRepo.exists).toHaveBeenCalledWith(userId, feedItemId);
      expect(mockRepo.delete).toHaveBeenCalledWith(userId, feedItemId);
    });

    it('should throw 404 when bookmark not found', async () => {
      mockRepo.exists.mockResolvedValue(false);

      await expect(service.remove(userId, feedItemId)).rejects.toThrow(AppError);
      await expect(service.remove(userId, feedItemId)).rejects.toMatchObject({
        message: 'Bookmark not found',
        statusCode: 404,
      });
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
