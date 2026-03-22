import { prisma } from '../../../config/database';

const LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  icon: true,
  color: true,
  gradient: true,
  sortOrder: true,
  isActive: true,
  _count: { select: { models: true, agents: true, apps: true, discoveries: true } },
};

const DETAIL_SELECT = {
  ...LIST_SELECT,
  discoveries: {
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' as const },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      coverImageUrl: true,
      difficulty: true,
      xp: true,
      publishedAt: true,
    },
  },
};

export class IndustryRepository {
  async findAllActive() {
    return prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: LIST_SELECT,
    });
  }

  async findBySlug(slug: string) {
    return prisma.industry.findUnique({
      where: { slug },
      select: DETAIL_SELECT,
    });
  }
}

export const industryRepository = new IndustryRepository();
