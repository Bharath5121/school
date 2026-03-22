import { prisma } from '../../../config/database';

const LIST_SELECT = {
  id: true, title: true, slug: true, summary: true, industrySlug: true,
  difficulty: true, isPublished: true, isFeatured: true, sortOrder: true,
  xp: true, publishedAt: true, createdAt: true,
  industry: { select: { name: true, slug: true } },
  _count: { select: { links: true, chatMessages: true } },
};

const DETAIL_SELECT = {
  id: true, title: true, slug: true, summary: true, description: true,
  coverImageUrl: true, industrySlug: true, difficulty: true,
  videoUrl: true, videoTitle: true,
  notebookLmUrl: true, notebookDescription: true,
  architectureDescription: true, architectureDiagramUrl: true,
  isPublished: true, publishedAt: true, isFeatured: true,
  sortOrder: true, xp: true, createdAt: true, updatedAt: true,
  industry: { select: { name: true, slug: true, icon: true, color: true } },
  links: { orderBy: { sortOrder: 'asc' as const }, select: {
    id: true, type: true, name: true, description: true, redirectUrl: true, sortOrder: true,
  }},
};

export class DiscoveryRepository {
  async findAll(opts: { search?: string; industrySlug?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (opts.industrySlug) where.industrySlug = opts.industrySlug;
    if (opts.search) {
      where.OR = [
        { title: { contains: opts.search, mode: 'insensitive' } },
        { summary: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      (prisma as any).discovery.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: LIST_SELECT,
        skip: opts.skip || 0,
        take: opts.take || 50,
      }),
      (prisma as any).discovery.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return (prisma as any).discovery.findUnique({ where: { id }, select: DETAIL_SELECT });
  }

  async create(data: any) {
    const { links, ...discoveryData } = data;
    if (discoveryData.isPublished && !discoveryData.publishedAt) {
      discoveryData.publishedAt = new Date();
    }
    return (prisma as any).discovery.create({
      data: {
        ...discoveryData,
        links: links?.length ? { create: links } : undefined,
      },
      select: DETAIL_SELECT,
    });
  }

  async update(id: string, data: any) {
    const { links, ...discoveryData } = data;
    if (discoveryData.isPublished === true) {
      const existing = await (prisma as any).discovery.findUnique({ where: { id }, select: { publishedAt: true } });
      if (!existing?.publishedAt) discoveryData.publishedAt = new Date();
    }
    return (prisma as any).discovery.update({ where: { id }, data: discoveryData, select: DETAIL_SELECT });
  }

  async delete(id: string) {
    return (prisma as any).discovery.delete({ where: { id } });
  }

  async addLink(discoveryId: string, linkData: any) {
    return (prisma as any).discoveryLink.create({
      data: { ...linkData, discoveryId },
    });
  }

  async removeLink(linkId: string) {
    return (prisma as any).discoveryLink.delete({ where: { id: linkId } });
  }

  async togglePublish(id: string) {
    const existing = await (prisma as any).discovery.findUnique({ where: { id }, select: { isPublished: true } });
    if (!existing) return null;
    const isPublished = !existing.isPublished;
    return (prisma as any).discovery.update({
      where: { id },
      data: { isPublished, publishedAt: isPublished ? new Date() : null },
      select: DETAIL_SELECT,
    });
  }

  async count() {
    return (prisma as any).discovery.count();
  }
}

export const discoveryRepository = new DiscoveryRepository();
