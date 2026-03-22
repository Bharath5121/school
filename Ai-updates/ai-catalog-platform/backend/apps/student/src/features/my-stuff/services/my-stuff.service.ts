import { MyStuffRepository } from '../repositories/my-stuff.repository';

export class MyStuffService {
  private repo = new MyStuffRepository();

  async getSavedItems(userId: string) { return this.repo.getSavedItems(userId); }
  async isSaved(userId: string, contentType: string, contentId: string) { return this.repo.isSaved(userId, contentType, contentId); }

  async saveItem(userId: string, data: { contentType: string; contentId: string; title: string; url?: string; metadata?: any }) {
    return this.repo.saveItem(userId, data);
  }

  async unsaveItem(userId: string, contentType: string, contentId: string) {
    return this.repo.unsaveItem(userId, contentType, contentId);
  }

  async getHistory(userId: string, limit?: number) { return this.repo.getHistory(userId, limit); }

  async trackView(userId: string, data: { contentType: string; contentId: string; title: string; slug?: string; icon?: string; metadata?: any }) {
    return this.repo.trackView(userId, data);
  }

  async clearHistory(userId: string) { return this.repo.clearHistory(userId); }

  async getCounts(userId: string) {
    const [savedCount, historyCount] = await Promise.all([
      this.repo.getSavedCount(userId),
      this.repo.getHistoryCount(userId),
    ]);
    return { savedCount, historyCount };
  }
}
