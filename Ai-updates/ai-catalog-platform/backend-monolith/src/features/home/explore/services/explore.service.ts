import { ExploreRepository } from '../repositories/explore.repository';
import { AppError } from '../../../../shared/errors/AppError';

const repo = new ExploreRepository();

export class ExploreService {
  async getModels(filters: any, page: number, limit: number) {
    return repo.getModels(filters, { page, limit });
  }

  async getModelById(id: string) {
    const model = await repo.getModelById(id);
    if (!model) throw new AppError('Model not found', 404);
    return model;
  }

  async getAgentById(id: string) {
    const agent = await repo.getAgentById(id);
    if (!agent) throw new AppError('Agent not found', 404);
    return agent;
  }

  async getAgents(filters: any, page: number, limit: number) {
    return repo.getAgents(filters, { page, limit });
  }

  async getApps(filters: any, page: number, limit: number) {
    return repo.getApps(filters, { page, limit });
  }
}
