import { FeedRepository } from '../repositories/feed.repository';
import { CreateFeedItemDto } from '../dtos/create-feed-item.dto';
import { UpdateFeedItemDto } from '../dtos/update-feed-item.dto';
import { QueryFeedDto } from '../dtos/query-feed.dto';
import { AppError } from '../../../shared/errors/AppError';
import { Prisma } from '@prisma/client';
import { PaginatedResult } from '../types/pagination.types';

export class FeedService {
  private repo = new FeedRepository();

  async createItem(dto: any) {
    const data = {
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      contentType: dto.contentType,
      fieldSlug: dto.fieldSlug,
      targetRole: dto.targetRole,
      careerImpactScore: dto.careerImpactScore,
      careerImpactText: dto.careerImpactText,
      metadata: dto.metadata || {}
    };

    return this.repo.create(data as any);
  }

  async updateItem(id: string, dto: any) {
    const item = await this.repo.findById(id);
    if (!item) throw new AppError('Feed item not found', 404);

    return this.repo.update(id, dto as any);
  }

  async deleteItem(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new AppError('Feed item not found', 404);

    await this.repo.delete(id);
  }

  async getItem(id: string) {
    const item = await this.repo.findById(id);
    if (!item) throw new AppError('Feed item not found', 404);
    return item;
  }

  async getFeed(query: QueryFeedDto): Promise<PaginatedResult<any>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const dbQuery: any = {};
    if (query.fieldSlug) dbQuery.fieldSlug = query.fieldSlug;
    if (query.contentType) dbQuery.contentType = query.contentType;
    if (query.search) {
      dbQuery.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const { items, total } = await this.repo.findMany(dbQuery, skip, limit);

    return {
      data: items,
      total,
      page,
      limit
    };
  }

  async getTrending() {
    return this.repo.getTrending(10);
  }

  async getFields() {
    // Fields/industries are now managed by home-service from the database.
    // This endpoint is kept for backward compatibility but fetches from DB.
    const items = await this.repo.getDistinctFields();
    return items;
  }
}
