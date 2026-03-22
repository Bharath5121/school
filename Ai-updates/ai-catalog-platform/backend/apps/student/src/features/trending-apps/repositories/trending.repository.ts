import { prisma } from '../../../config/database';

const APP_CARD_SELECT = {
  id: true, slug: true, name: true, tagline: true, icon: true, logoUrl: true,
  provider: true, url: true, isFree: true, isAd: true, launchDate: true,
  category: { select: { title: true, slug: true, icon: true } },
  industry: { select: { name: true, slug: true, icon: true } },
} as const;

const APP_DETAIL_SELECT = {
  ...APP_CARD_SELECT,
  description: true, usage: true, howItHelps: true, coverImageUrl: true,
} as const;

export class TrendingRepository {
  async findAllCategories() {
    return prisma.trendingCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, slug: true, title: true, description: true, icon: true, sortOrder: true,
        _count: { select: { apps: { where: { isPublished: true } } } },
      },
    });
  }

  async findCategoryBySlug(slug: string) {
    return prisma.trendingCategory.findUnique({
      where: { slug },
      select: {
        id: true, slug: true, title: true, description: true, icon: true,
        apps: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          select: APP_CARD_SELECT,
        },
      },
    });
  }

  async findAppsByIndustry(industrySlug: string) {
    return prisma.trendingApp.findMany({
      where: { industrySlug, isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: APP_CARD_SELECT,
    });
  }

  async findAppsByIndustries(industrySlugs: string[]) {
    return prisma.trendingApp.findMany({
      where: { industrySlug: { in: industrySlugs }, isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: APP_CARD_SELECT,
    });
  }

  async findAppBySlug(slug: string) {
    return prisma.trendingApp.findUnique({
      where: { slug },
      select: APP_DETAIL_SELECT,
    });
  }

  async getUserIndustries(userId: string) {
    const selections = await prisma.userIndustrySelection.findMany({
      where: { userId },
      select: { industrySlug: true, industry: { select: { name: true, slug: true, icon: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return selections;
  }
}
