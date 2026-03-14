import { prisma } from '../../../../config/database';

export class SkillRepository {
  async findByUser(userId: string) {
    return prisma.userSkillProgress.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async upsertStatus(userId: string, skillId: string, status: 'NOT_STARTED' | 'EXPLORING' | 'LEARNED') {
    return prisma.userSkillProgress.upsert({
      where: { userId_skillId: { userId, skillId } },
      create: { userId, skillId, status },
      update: { status },
    });
  }

  async getSummary(userId: string) {
    const progress = await prisma.userSkillProgress.findMany({
      where: { userId },
    });

    const statusCounts = { NOT_STARTED: 0, EXPLORING: 0, LEARNED: 0 };
    for (const p of progress) {
      statusCounts[p.status]++;
    }

    return {
      total: progress.length,
      ...statusCounts,
    };
  }
}
