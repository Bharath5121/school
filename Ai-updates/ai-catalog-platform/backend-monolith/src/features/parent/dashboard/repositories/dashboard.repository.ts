import { prisma } from '../../../../config/database';

export class ParentDashboardRepository {
  async getParentWithProfile(userId: string) {
    return (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        profile: { select: { gradeLevel: true, avatarUrl: true } },
      },
    });
  }

  async getLinkedChildrenWithStats(parentId: string) {
    const links = await (prisma as any).parentChildLink.findMany({
      where: { parentId },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                gradeLevel: true,
                avatarUrl: true,
                interests: { select: { fieldName: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const childrenWithStats = await Promise.all(
      links.map(async (link: any) => {
        const childId = link.child.id;

        const [skillProgress, careerCount, readingThisWeek, notebookThisWeek] = await Promise.all([
          (prisma as any).userSkillProgress.findMany({ where: { userId: childId } }),
          (prisma as any).userCareerExplored.count({ where: { userId: childId } }),
          (prisma as any).readingHistory.findMany({
            where: { userId: childId, lastReadAt: { gte: weekAgo } },
            select: { timeSpentSeconds: true },
          }),
          (prisma as any).notebookAccessLog.count({
            where: { userId: childId, accessedAt: { gte: weekAgo } },
          }),
        ]);

        const skillsLearned = skillProgress.filter((s: any) => s.status === 'LEARNED').length;
        const totalMinutesThisWeek = Math.round(
          readingThisWeek.reduce((sum: number, r: any) => sum + (r.timeSpentSeconds || 0), 0) / 60
        );

        return {
          id: childId,
          name: link.child.name,
          email: link.child.email,
          gradeLevel: link.child.profile?.gradeLevel ?? null,
          avatarUrl: link.child.profile?.avatarUrl ?? null,
          interests: link.child.profile?.interests?.map((i: any) => i.fieldName) ?? [],
          stats: {
            skillsLearned,
            skillsTotal: skillProgress.length,
            careersExplored: careerCount,
            minutesThisWeek: totalMinutesThisWeek,
            itemsReadThisWeek: readingThisWeek.length,
            notebooksThisWeek: notebookThisWeek,
          },
        };
      })
    );

    return childrenWithStats;
  }

  async getUnreadNotificationCount(parentId: string): Promise<number> {
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
}
