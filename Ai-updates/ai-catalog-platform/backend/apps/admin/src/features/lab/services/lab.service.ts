import { LabRepository } from '../repositories/lab.repository';
import { LabCacheKeys } from '../cache/lab.cache';
import { cacheDelPattern } from '../../../shared/utils/cache';
import type { CreateCategoryDto, UpdateCategoryDto, CreateItemDto, UpdateItemDto } from '../dtos/lab.dto';

export class LabService {
  private repo = new LabRepository();

  async getAllCategories() { return this.repo.findAllCategories(); }
  async getCategoryById(id: string) { return this.repo.findCategoryById(id); }

  async createCategory(data: CreateCategoryDto) {
    const r = await this.repo.createCategory(data);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const r = await this.repo.updateCategory(id, data);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }

  async deleteCategory(id: string) {
    const r = await this.repo.deleteCategory(id);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }

  async getAllItems() { return this.repo.findAllItems(); }
  async getItemById(id: string) { return this.repo.findItemById(id); }

  async createItem(data: CreateItemDto) {
    const r = await this.repo.createItem(data);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }

  async updateItem(id: string, data: UpdateItemDto) {
    const r = await this.repo.updateItem(id, data);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }

  async deleteItem(id: string) {
    const r = await this.repo.deleteItem(id);
    await cacheDelPattern(LabCacheKeys.pattern());
    return r;
  }
}
