import { ModelsRepository } from '../repositories/models.repository';
import { AgentsRepository } from '../repositories/agents.repository';
import { AppsRepository } from '../repositories/apps.repository';
import { redis } from '../../../../config/redis';

export class DetailService {
  private modelsRepo = new ModelsRepository();
  private agentsRepo = new AgentsRepository();
  private appsRepo = new AppsRepository();

  async getIndustryDetail(slug: string) {
    const cacheKey = `industry:detail:${slug}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [models, agents, apps] = await Promise.all([
      this.modelsRepo.getByIndustry(slug),
      this.agentsRepo.getByIndustry(slug),
      this.appsRepo.getByIndustry(slug)
    ]);

    const result = { models, agents, apps };
    await redis.setex(cacheKey, 1800, JSON.stringify(result)); // 30 min
    return result;
  }

  async getModels(slug: string) { return this.modelsRepo.getByIndustry(slug); }
  async getAgents(slug: string) { return this.agentsRepo.getByIndustry(slug); }
  async getApps(slug: string) { return this.appsRepo.getByIndustry(slug); }
}
