import { CareersRepository } from '../repositories/careers.repository';
import { AppError } from '../../../../shared/errors/AppError';

const repo = new CareersRepository();

export class CareersService {
  async getCareerPaths(industrySlug: string) {
    const paths = await repo.getCareerPaths(industrySlug);
    if (!paths.length) throw new AppError('No career paths found for this industry', 404);
    return paths;
  }

  async getJobs(industrySlug: string) {
    return repo.getJobs(industrySlug);
  }

  async getJobById(id: string) {
    const job = await repo.getJobById(id);
    if (!job) throw new AppError('Career job not found', 404);
    return job;
  }

  async getSkills(industrySlug: string) {
    return repo.getSkills(industrySlug);
  }
}
