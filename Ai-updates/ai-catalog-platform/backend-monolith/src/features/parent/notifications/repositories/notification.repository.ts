import { prisma } from '../../../../config/database';

export class NotificationRepository {
  async getNotesForParent(parentId: string, page = 1, limit = 20) {
    const childLinks = await (prisma as any).parentChildLink.findMany({
      where: { parentId },
      select: { childId: true },
    });
    const childIds = childLinks.map((l: any) => l.childId);

    if (childIds.length === 0) return { notes: [], total: 0 };

    const where = {
      OR: [
        { parentId },
        { studentId: { in: childIds }, parentId: null },
      ],
    };

    const [notes, total] = await Promise.all([
      (prisma as any).teacherNote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      (prisma as any).teacherNote.count({ where }),
    ]);

    return { notes, total };
  }

  async getUnreadCount(parentId: string): Promise<number> {
    const childLinks = await (prisma as any).parentChildLink.findMany({
      where: { parentId },
      select: { childId: true },
    });
    const childIds = childLinks.map((l: any) => l.childId);
    if (childIds.length === 0) return 0;

    return (prisma as any).teacherNote.count({
      where: {
        isRead: false,
        OR: [
          { parentId },
          { studentId: { in: childIds }, parentId: null },
        ],
      },
    });
  }

  async markAsRead(noteId: string, parentId: string) {
    return (prisma as any).teacherNote.updateMany({
      where: { id: noteId },
      data: { isRead: true, parentId },
    });
  }
}
