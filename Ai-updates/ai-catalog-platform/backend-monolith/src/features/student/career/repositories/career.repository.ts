import { prisma } from '../../../../config/database';

export class CareerRepository {
  async getExploredByUser(userId: string) {
    return prisma.userCareerExplored.findMany({
      where: { userId },
      orderBy: { exploredAt: 'desc' },
    });
  }

  async markExplored(userId: string, careerJobId: string) {
    return prisma.userCareerExplored.upsert({
      where: { userId_careerJobId: { userId, careerJobId } },
      create: { userId, careerJobId },
      update: { exploredAt: new Date() },
    });
  }

  async removeExplored(userId: string, careerJobId: string) {
    return prisma.userCareerExplored.deleteMany({
      where: { userId, careerJobId },
    });
  }

  async getStats(userId: string) {
    const explored = await prisma.userCareerExplored.findMany({
      where: { userId },
    });

    return {
      totalExplored: explored.length,
      jobIds: explored.map(e => e.careerJobId),
    };
  }
}
