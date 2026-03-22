import { prisma } from '../../../config/database';
import type { CreateCategoryDto, UpdateCategoryDto, CreateItemDto, UpdateItemDto } from '../dtos/lab.dto';

const CATEGORY_SELECT = {
  id: true, slug: true, title: true, description: true,
  icon: true, sortOrder: true, isPublished: true,
  createdAt: true, updatedAt: true,
} as const;

const ITEM_SELECT = {
  id: true, slug: true, title: true, tagline: true, description: true,
  icon: true, provider: true, type: true, useCases: true, features: true,
  sortOrder: true, isPublished: true, categoryId: true,
  createdAt: true, updatedAt: true,
} as const;

export class LabRepository {
  // ─── Categories ─────────────────────────────────────────────

  async findAllCategories() {
    return prisma.labCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { ...CATEGORY_SELECT, _count: { select: { items: true } } },
    });
  }

  async findCategoryById(id: string) {
    return prisma.labCategory.findUnique({
      where: { id },
      select: {
        ...CATEGORY_SELECT,
        items: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, slug: true, title: true, tagline: true, icon: true, provider: true, type: true, sortOrder: true, isPublished: true },
        },
      },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    return prisma.labCategory.create({ data: data as any, select: CATEGORY_SELECT });
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return prisma.labCategory.update({ where: { id }, data: data as any, select: CATEGORY_SELECT });
  }

  async deleteCategory(id: string) {
    return prisma.labCategory.delete({ where: { id }, select: { id: true, title: true } });
  }

  // ─── Items ──────────────────────────────────────────────────

  async findAllItems() {
    return prisma.labItem.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { ...ITEM_SELECT, category: { select: { id: true, title: true, slug: true } } },
    });
  }

  async findItemById(id: string) {
    return prisma.labItem.findUnique({
      where: { id },
      select: { ...ITEM_SELECT, category: { select: { id: true, title: true, slug: true } } },
    });
  }

  async createItem(data: CreateItemDto) {
    return prisma.labItem.create({
      data: data as any,
      select: { ...ITEM_SELECT, category: { select: { id: true, title: true, slug: true } } },
    });
  }

  async updateItem(id: string, data: UpdateItemDto) {
    return prisma.labItem.update({
      where: { id },
      data: data as any,
      select: { ...ITEM_SELECT, category: { select: { id: true, title: true, slug: true } } },
    });
  }

  async deleteItem(id: string) {
    return prisma.labItem.delete({ where: { id }, select: { id: true, title: true } });
  }
}
