import { prisma } from '../../../config/database';

const CARD_SELECT = {
  id: true, title: true, slug: true, summary: true, coverImageUrl: true,
  industrySlug: true, difficulty: true, isFeatured: true, xp: true,
  publishedAt: true, videoUrl: true, notebookLmUrl: true,
  architectureDescription: true,
  industry: { select: { name: true, slug: true, icon: true, color: true } },
  _count: { select: { links: true } },
};

const DETAIL_SELECT = {
  id: true, title: true, slug: true, summary: true, description: true,
  coverImageUrl: true, industrySlug: true, difficulty: true,
  videoUrl: true, videoTitle: true,
  notebookLmUrl: true, notebookDescription: true,
  architectureDescription: true, architectureDiagramUrl: true,
  isFeatured: true, xp: true, publishedAt: true,
  industry: { select: { name: true, slug: true, icon: true, color: true } },
  links: { orderBy: { sortOrder: 'asc' as const }, select: {
    id: true, type: true, name: true, description: true, redirectUrl: true, sortOrder: true,
  }},
};

export class DiscoveryRepository {
  async findPublished(opts: { featured?: boolean; skip?: number; take?: number }) {
    const where: any = { isPublished: true };
    if (opts.featured !== undefined) where.isFeatured = opts.featured;

    const [items, total] = await Promise.all([
      (prisma as any).discovery.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
        select: CARD_SELECT,
        skip: opts.skip || 0,
        take: opts.take || 20,
      }),
      (prisma as any).discovery.count({ where }),
    ]);

    return { items, total };
  }

  async findBySlug(slug: string) {
    return (prisma as any).discovery.findFirst({
      where: { slug, isPublished: true },
      select: DETAIL_SELECT,
    });
  }

  async getChatMessages(discoveryId: string, take = 50) {
    return (prisma as any).discoveryChatMsg.findMany({
      where: { discoveryId },
      orderBy: { createdAt: 'asc' },
      take,
      select: {
        id: true, message: true, response: true, createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }

  async createChatMessage(discoveryId: string, userId: string, message: string) {
    return (prisma as any).discoveryChatMsg.create({
      data: { discoveryId, userId, message },
      select: {
        id: true, message: true, response: true, createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }
}

export const discoveryRepository = new DiscoveryRepository();
