import { prisma } from '../../../config/database';

export class LabRepository {
  async findAllCategories() {
    return prisma.labCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, slug: true, title: true, description: true, icon: true, sortOrder: true,
        _count: {
          select: {
            items: { where: { isPublished: true } },
          },
        },
      },
    });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.labCategory.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, description: true, icon: true,
        items: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true, slug: true, title: true, tagline: true, icon: true, provider: true,
            type: true, sortOrder: true, features: true,
          },
        },
      },
    });
  }

  async findItemBySlug(slug: string) {
    return prisma.labItem.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, tagline: true, description: true, icon: true,
        provider: true, type: true, useCases: true, features: true,
        category: { select: { id: true, slug: true, title: true } },
      },
    });
  }

  async findChatMessages(itemSlug: string) {
    const item = await prisma.labItem.findUnique({ where: { slug: itemSlug }, select: { id: true } });
    if (!item) return [];
    return prisma.labItemChatMsg.findMany({
      where: { itemId: item.id },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true, message: true, response: true, createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }

  async createChatMessage(itemSlug: string, userId: string, message: string) {
    const item = await prisma.labItem.findUnique({ where: { slug: itemSlug }, select: { id: true } });
    if (!item) throw new Error('Item not found');
    return prisma.labItemChatMsg.create({
      data: { itemId: item.id, userId, message },
      select: {
        id: true, message: true, response: true, createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }
}
