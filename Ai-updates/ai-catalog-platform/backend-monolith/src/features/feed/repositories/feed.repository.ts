import { prisma } from '../../../config/database';
import { redis } from '../../../config/redis';
import { Prisma, FeedItem } from '@prisma/client';
import { PaginatedResult } from '../types/pagination.types';

export class FeedRepository {
  async create(data: Prisma.FeedItemCreateInput): Promise<FeedItem> {
    return (prisma as any).feedItem.create({ data });
  }

  async update(id: string, data: Prisma.FeedItemUpdateInput): Promise<FeedItem> {
    return (prisma as any).feedItem.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await (prisma as any).feedItem.delete({ where: { id } });
  }

  async findById(id: string): Promise<FeedItem | null> {
    const cached = await redis.get(`feed:${id}`);
    if (cached) {
      this.incrementViews(id);
      return JSON.parse(cached);
    }

    const item = await (prisma as any).feedItem.findUnique({
      where: { id }
    });

    if (item) {
      await redis.set(`feed:${id}`, JSON.stringify(item), 'EX', 3600);
      this.incrementViews(id);
    }

    return item;
  }

  async findMany(query: any, skip: number, take: number) {
    // Generate a secure cache key
    const cacheKey = `feed:query:${JSON.stringify(query)}:${skip}:${take}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const [items, total] = await Promise.all([
      (prisma as any).feedItem.findMany({
        where: query,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      (prisma as any).feedItem.count({ where: query })
    ]);

    const result = { items, total };
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 600); // 10 min cache
    return result;
  }

  async getTrending(limit: number = 10) {
    const cached = await redis.get(`feed:trending:${limit}`);
    if (cached) return JSON.parse(cached);

    const items = await (prisma as any).feedItem.findMany({
      orderBy: { views: 'desc' },
      take: limit
    });

    await redis.set(`feed:trending:${limit}`, JSON.stringify(items), 'EX', 1800); // 30 min cache
    return items;
  }

  async getDistinctFields() {
    const items = await (prisma as any).feedItem.findMany({
      select: { fieldSlug: true },
      distinct: ['fieldSlug'],
    });
    return items.map((i: any) => ({ slug: i.fieldSlug, name: i.fieldSlug }));
  }

  private async incrementViews(id: string) {
    await prisma.feedItem.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch(() => {});
  }
}
