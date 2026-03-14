import { BookmarkRepository } from '../repositories/bookmark.repository';
import { AppError } from '../../../../shared/errors/AppError';

const repo = new BookmarkRepository();

export class BookmarkService {
  async list(userId: string, page: number, limit: number, contentType?: string) {
    return repo.findByUser(userId, page, limit, contentType);
  }

  async add(userId: string, feedItemId: string) {
    const exists = await repo.exists(userId, feedItemId);
    if (exists) throw new AppError('Item already bookmarked', 409);
    return repo.create(userId, feedItemId);
  }

  async remove(userId: string, feedItemId: string) {
    const exists = await repo.exists(userId, feedItemId);
    if (!exists) throw new AppError('Bookmark not found', 404);
    return repo.delete(userId, feedItemId);
  }
}
