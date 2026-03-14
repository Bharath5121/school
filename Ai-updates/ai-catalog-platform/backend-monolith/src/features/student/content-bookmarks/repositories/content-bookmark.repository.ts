import { prisma } from '../../../../config/database';

export class ContentBookmarkRepository {
  async list(userId: string, contentType?: string) {
    return prisma.contentBookmark.findMany({
      where: { userId, ...(contentType ? { contentType } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: string, data: { contentType: string; contentId: string; title: string; url?: string; metadata?: any }) {
    return prisma.contentBookmark.upsert({
      where: { userId_contentType_contentId: { userId, contentType: data.contentType, contentId: data.contentId } },
      create: { userId, ...data },
      update: { title: data.title, url: data.url },
    });
  }

  async remove(userId: string, contentType: string, contentId: string) {
    return prisma.contentBookmark.deleteMany({
      where: { userId, contentType, contentId },
    });
  }

  async exists(userId: string, contentType: string, contentId: string) {
    const entry = await prisma.contentBookmark.findUnique({
      where: { userId_contentType_contentId: { userId, contentType, contentId } },
    });
    return !!entry;
  }

  async listByIds(userId: string, contentType: string, contentIds: string[]) {
    return prisma.contentBookmark.findMany({
      where: { userId, contentType, contentId: { in: contentIds } },
    });
  }
}
