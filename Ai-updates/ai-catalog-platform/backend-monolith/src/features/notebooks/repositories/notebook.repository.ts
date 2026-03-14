import { NotebookCategory, SourceType, Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';

export class NotebookRepository {
  // ─── Master Notebooks ──────────────────────────────────

  async findAll(industrySlug?: string) {
    return prisma.masterNotebook.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ industrySlug: 'asc' }, { category: 'asc' }],
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        _count: { select: { sources: true, accessLogs: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.masterNotebook.findUnique({
      where: { id },
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        sources: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { accessLogs: true, chatMessages: true } },
      },
    });
  }

  async findPublishedByCategory(category: NotebookCategory) {
    return prisma.masterNotebook.findMany({
      where: { category, published: true },
      orderBy: [{ gradeLevel: 'asc' }, { createdAt: 'desc' }],
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        _count: { select: { sources: true } },
      },
    });
  }

  async findPublishedNotebooks(filters?: { gradeLevel?: string; difficultyLevel?: string }) {
    const where: Prisma.MasterNotebookWhereInput = { published: true };
    if (filters?.gradeLevel) where.gradeLevel = filters.gradeLevel;
    if (filters?.difficultyLevel) where.difficultyLevel = filters.difficultyLevel;

    return prisma.masterNotebook.findMany({
      where,
      orderBy: [{ gradeLevel: 'asc' }, { difficultyLevel: 'asc' }, { createdAt: 'desc' }],
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        _count: { select: { sources: true } },
      },
    });
  }

  async create(data: {
    industrySlug: string;
    category: NotebookCategory;
    title: string;
    description?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
    workspaceSlug?: string;
    workspaceCreated?: boolean;
    createdBy: string;
  }) {
    return prisma.masterNotebook.create({
      data,
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        _count: { select: { sources: true } },
      },
    });
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
    workspaceSlug?: string;
    workspaceCreated?: boolean;
    sourcesCount?: number;
    published?: boolean;
  }) {
    return prisma.masterNotebook.update({
      where: { id },
      data,
      include: {
        industry: { select: { name: true, slug: true, icon: true, color: true } },
        sources: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { accessLogs: true, chatMessages: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.masterNotebook.delete({ where: { id } });
  }

  async incrementSourcesCount(notebookId: string) {
    return prisma.masterNotebook.update({
      where: { id: notebookId },
      data: { sourcesCount: { increment: 1 } },
    });
  }

  async decrementSourcesCount(notebookId: string) {
    return prisma.masterNotebook.update({
      where: { id: notebookId },
      data: { sourcesCount: { decrement: 1 } },
    });
  }

  // ─── Sources ───────────────────────────────────────────

  async addSource(data: {
    notebookId: string;
    type: SourceType;
    title: string;
    url?: string;
    filePath?: string;
    metadata?: Prisma.InputJsonValue;
    sortOrder?: number;
  }) {
    return prisma.notebookSource.create({ data });
  }

  async deleteSource(sourceId: string) {
    return prisma.notebookSource.delete({ where: { id: sourceId } });
  }

  async findSourceById(sourceId: string) {
    return prisma.notebookSource.findUnique({ where: { id: sourceId } });
  }

  // ─── Access Logs ───────────────────────────────────────

  async logAccess(userId: string, notebookId: string) {
    return prisma.notebookAccessLog.create({
      data: { userId, notebookId },
    });
  }

  async countUserAccessToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.notebookAccessLog.count({
      where: { userId, accessedAt: { gte: startOfDay } },
    });
  }

  async getUserAccessHistory(userId: string, limit = 20) {
    const logs = await prisma.notebookAccessLog.findMany({
      where: { userId },
      orderBy: { accessedAt: 'desc' },
      take: limit,
      include: {
        notebook: {
          select: {
            id: true,
            title: true,
            category: true,
            industrySlug: true,
            workspaceSlug: true,
            gradeLevel: true,
            difficultyLevel: true,
            sourcesCount: true,
            industry: { select: { name: true, icon: true, color: true } },
          },
        },
      },
    });

    const seen = new Set<string>();
    return logs.filter((log) => {
      if (seen.has(log.notebookId)) return false;
      seen.add(log.notebookId);
      return true;
    });
  }

  // ─── Chat Messages ────────────────────────────────────

  async saveChatMessage(data: {
    userId: string;
    notebookId: string;
    workspaceSlug: string;
    message: string;
    response: string;
  }) {
    return prisma.notebookChatMessage.create({ data });
  }

  async getChatHistory(userId: string, notebookId: string, limit = 50) {
    return prisma.notebookChatMessage.findMany({
      where: { userId, notebookId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      select: {
        id: true,
        message: true,
        response: true,
        createdAt: true,
      },
    });
  }

  async clearChatHistory(userId: string, notebookId: string) {
    return prisma.notebookChatMessage.deleteMany({
      where: { userId, notebookId },
    });
  }

  async getLastChatDate(userId: string, notebookId: string) {
    const msg = await prisma.notebookChatMessage.findFirst({
      where: { userId, notebookId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    return msg?.createdAt ?? null;
  }
}
