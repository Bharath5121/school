import { TrendingRepository } from '../repositories/trending.repository';

const repo = new TrendingRepository();

export class TrendingService {
  async getTrending(timeframe = 'today', limit = 10, type?: string) {
    return repo.getTrending(timeframe, limit, type);
  }

  async getWhatsNew(fieldSlugs?: string[], contentType?: string, showAll = false) {
    return repo.getWhatsNew(fieldSlugs, contentType, showAll);
  }
}
