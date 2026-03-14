import { ContentBookmarkRepository } from '../repositories/content-bookmark.repository';

const repo = new ContentBookmarkRepository();

export class ContentBookmarkService {
  async list(userId: string, contentType?: string) {
    return repo.list(userId, contentType);
  }

  async add(userId: string, data: { contentType: string; contentId: string; title: string; url?: string; metadata?: any }) {
    return repo.add(userId, data);
  }

  async remove(userId: string, contentType: string, contentId: string) {
    return repo.remove(userId, contentType, contentId);
  }

  async check(userId: string, contentType: string, contentIds: string[]) {
    const bookmarks = await repo.listByIds(userId, contentType, contentIds);
    return new Set(bookmarks.map(b => b.contentId));
  }
}
