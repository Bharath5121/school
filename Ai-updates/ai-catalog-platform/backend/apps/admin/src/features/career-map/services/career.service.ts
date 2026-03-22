import { CareerRepository } from '../repositories/career.repository';
import { CareerCacheKeys } from '../cache/career.cache';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreatePathDto, UpdatePathDto, CreateJobDto, UpdateJobDto } from '../dtos/career.dto';

export class CareerService {
  private repo = new CareerRepository();

  async getAllPaths() { return this.repo.findAllPaths(); }
  async getPathById(id: string) { return this.repo.findPathById(id); }

  async createPath(data: CreatePathDto) {
    const r = await this.repo.createPath(data);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }

  async updatePath(id: string, data: UpdatePathDto) {
    const r = await this.repo.updatePath(id, data);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }

  async deletePath(id: string) {
    const r = await this.repo.deletePath(id);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }

  async getAllJobs() { return this.repo.findAllJobs(); }
  async getJobById(id: string) { return this.repo.findJobById(id); }

  async createJob(data: CreateJobDto) {
    const r = await this.repo.createJob(data);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }

  async updateJob(id: string, data: UpdateJobDto) {
    const r = await this.repo.updateJob(id, data);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }

  async deleteJob(id: string) {
    const r = await this.repo.deleteJob(id);
    await cacheDelPattern(CareerCacheKeys.pattern());
    return r;
  }
}
