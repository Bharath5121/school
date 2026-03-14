import { CareerRepository } from '../repositories/career.repository';

const repo = new CareerRepository();

export class CareerService {
  async getExplored(userId: string) {
    return repo.getExploredByUser(userId);
  }

  async markExplored(userId: string, careerJobId: string) {
    return repo.markExplored(userId, careerJobId);
  }

  async removeExplored(userId: string, careerJobId: string) {
    return repo.removeExplored(userId, careerJobId);
  }

  async getStats(userId: string) {
    return repo.getStats(userId);
  }
}
