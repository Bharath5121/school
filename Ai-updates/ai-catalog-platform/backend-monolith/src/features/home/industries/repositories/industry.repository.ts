import { prisma } from '../../../../config/database';

export class IndustryRepository {
  async getAllActive() {
    return prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            models: true,
            agents: true,
            apps: true,
          },
        },
      },
    });
  }

  async getBySlug(slug: string) {
    return prisma.industry.findUnique({
      where: { slug, isActive: true },
    });
  }

  async getPlatformStats() {
    const [totalModels, totalFields, totalUpdates] = await Promise.all([
      prisma.aIModel.count({ where: { isPublished: true } }),
      prisma.industry.count({ where: { isActive: true } }),
      prisma.aIAgent.count({
        where: {
          isPublished: true,
          createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      })
    ]);

    return { totalModels, totalFields, updatesToday: totalUpdates };
  }

  async getFieldStats(slugs: string[]) {
    return prisma.industry.findMany({
      where: { slug: { in: slugs }, isActive: true },
      select: {
        name: true,
        slug: true,
        icon: true,
        color: true,
        _count: {
          select: { models: true, agents: true, apps: true },
        },
      },
    });
  }

  async getLatestByField(slug: string, take = 3) {
    const [models, agents, apps] = await Promise.all([
      prisma.aIModel.findMany({
        where: { industrySlug: slug, isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take,
        select: { id: true, name: true, builtBy: true },
      }),
      prisma.aIAgent.findMany({
        where: { industrySlug: slug, isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take,
        select: { id: true, name: true, builtBy: true },
      }),
      prisma.aIApp.findMany({
        where: { industrySlug: slug, isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take,
        select: { id: true, name: true, builtBy: true },
      }),
    ]);
    return { models, agents, apps };
  }
}
