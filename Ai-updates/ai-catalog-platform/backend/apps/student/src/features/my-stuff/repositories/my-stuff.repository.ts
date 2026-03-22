import { prisma } from '../../../config/database';

export class MyStuffRepository {
  // ── Saved Items (ContentBookmark) ──

  async getSavedItems(userId: string) {
    return prisma.contentBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSavedItemIds(userId: string, contentType: string) {
    const items = await prisma.contentBookmark.findMany({
      where: { userId, contentType },
      select: { contentId: true },
    });
    return items.map((i) => i.contentId);
  }

  async isSaved(userId: string, contentType: string, contentId: string) {
    const item = await prisma.contentBookmark.findUnique({
      where: { userId_contentType_contentId: { userId, contentType, contentId } },
      select: { id: true },
    });
    return !!item;
  }

  async saveItem(userId: string, data: { contentType: string; contentId: string; title: string; url?: string; metadata?: any }) {
    return prisma.contentBookmark.upsert({
      where: {
        userId_contentType_contentId: { userId, contentType: data.contentType, contentId: data.contentId },
      },
      update: { title: data.title, url: data.url || null, metadata: data.metadata || {} },
      create: { userId, ...data, url: data.url || null, metadata: data.metadata || {} },
    });
  }

  async unsaveItem(userId: string, contentType: string, contentId: string) {
    return prisma.contentBookmark.deleteMany({
      where: { userId, contentType, contentId },
    });
  }

  async getSavedCount(userId: string) {
    return prisma.contentBookmark.count({ where: { userId } });
  }

  // ── Reading History (ContentViewHistory) ──

  async getHistory(userId: string, limit = 50) {
    return prisma.contentViewHistory.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: limit,
    });
  }

  async trackView(userId: string, data: { contentType: string; contentId: string; title: string; slug?: string; icon?: string; metadata?: any }) {
    const existing = await prisma.contentViewHistory.findFirst({
      where: { userId, contentType: data.contentType, contentId: data.contentId },
    });

    if (existing) {
      return prisma.contentViewHistory.update({
        where: { id: existing.id },
        data: { title: data.title, slug: data.slug, icon: data.icon, metadata: data.metadata || {}, viewedAt: new Date() },
      });
    }

    return prisma.contentViewHistory.create({
      data: { userId, ...data, metadata: data.metadata || {} },
    });
  }

  async clearHistory(userId: string) {
    return prisma.contentViewHistory.deleteMany({ where: { userId } });
  }

  async getHistoryCount(userId: string) {
    return prisma.contentViewHistory.count({ where: { userId } });
  }
}
