import { prisma } from '../../../config/database';
import type { CreateCategoryDto, UpdateCategoryDto, CreateAppDto, UpdateAppDto } from '../dtos/trending.dto';

const CATEGORY_SELECT = {
  id: true, slug: true, title: true, description: true,
  icon: true, sortOrder: true, isPublished: true,
  createdAt: true, updatedAt: true,
} as const;

const APP_SELECT = {
  id: true, slug: true, name: true, tagline: true, description: true,
  icon: true, logoUrl: true, coverImageUrl: true, provider: true, url: true, isFree: true, isAd: true,
  usage: true, howItHelps: true, launchDate: true,
  sortOrder: true, isPublished: true, categoryId: true, industrySlug: true,
  createdAt: true, updatedAt: true,
} as const;

export class TrendingRepository {
  async findAllCategories() {
    return prisma.trendingCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { ...CATEGORY_SELECT, _count: { select: { apps: true } } },
    });
  }

  async findCategoryById(id: string) {
    return prisma.trendingCategory.findUnique({
      where: { id },
      select: {
        ...CATEGORY_SELECT,
        apps: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, slug: true, name: true, tagline: true, icon: true, provider: true, sortOrder: true, isPublished: true, industrySlug: true },
        },
      },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    return prisma.trendingCategory.create({ data: data as any, select: CATEGORY_SELECT });
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return prisma.trendingCategory.update({ where: { id }, data: data as any, select: CATEGORY_SELECT });
  }

  async deleteCategory(id: string) {
    return prisma.trendingCategory.delete({ where: { id }, select: { id: true, title: true } });
  }

  async findAllApps() {
    return prisma.trendingApp.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        ...APP_SELECT,
        category: { select: { id: true, title: true, slug: true } },
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async findAppById(id: string) {
    return prisma.trendingApp.findUnique({
      where: { id },
      select: {
        ...APP_SELECT,
        category: { select: { id: true, title: true, slug: true } },
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async createApp(data: CreateAppDto) {
    return prisma.trendingApp.create({
      data: data as any,
      select: { ...APP_SELECT, category: { select: { id: true, title: true, slug: true } }, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async updateApp(id: string, data: UpdateAppDto) {
    return prisma.trendingApp.update({
      where: { id },
      data: data as any,
      select: { ...APP_SELECT, category: { select: { id: true, title: true, slug: true } }, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async deleteApp(id: string) {
    return prisma.trendingApp.delete({ where: { id }, select: { id: true, name: true } });
  }
}
