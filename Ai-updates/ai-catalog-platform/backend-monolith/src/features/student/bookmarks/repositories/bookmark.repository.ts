import { prisma } from '../../../../config/database';

export class BookmarkRepository {
  async findByUser(userId: string, page: number, limit: number, contentType?: string) {
    const where: any = { userId };
    if (contentType) {
      where.feedItem = { contentType };
    }

    const [items, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        include: {
          feedItem: {
            select: {
              id: true,
              title: true,
              summary: true,
              contentType: true,
              fieldSlug: true,
              publishedAt: true,
              views: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookmark.count({ where }),
    ]);

    return { items, total };
  }

  async create(userId: string, feedItemId: string) {
    return prisma.bookmark.create({
      data: { userId, feedItemId },
      include: { feedItem: { select: { id: true, title: true, contentType: true } } },
    });
  }

  async delete(userId: string, feedItemId: string) {
    return prisma.bookmark.delete({
      where: { userId_feedItemId: { userId, feedItemId } },
    });
  }

  async exists(userId: string, feedItemId: string) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_feedItemId: { userId, feedItemId } },
    });
    return !!bookmark;
  }
}
