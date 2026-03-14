import { HistoryRepository } from '../repositories/history.repository';

const repo = new HistoryRepository();

export class HistoryService {
  async list(userId: string, page: number, limit: number, timeframe?: string) {
    let since: Date | undefined;
    const now = new Date();
    if (timeframe === 'today') since = new Date(now.setHours(0, 0, 0, 0));
    else if (timeframe === 'week') since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (timeframe === 'month') since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return repo.findByUser(userId, page, limit, since);
  }

  async track(userId: string, feedItemId: string, timeSpentSeconds: number) {
    return repo.upsert(userId, feedItemId, timeSpentSeconds);
  }

  async stats(userId: string) {
    return repo.getStats(userId);
  }

  async clear(userId: string) {
    return repo.clearAll(userId);
  }
}
