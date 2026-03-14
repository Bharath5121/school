import { prisma } from '../../../../config/database';

interface PaginationOpts {
  page: number;
  limit: number;
}

interface ModelFilters {
  industrySlug?: string;
  builtBy?: string;
  isFree?: boolean;
  search?: string;
}

interface AppFilters {
  industrySlug?: string;
  isFree?: boolean;
  whoUsesIt?: string;
  search?: string;
}

export class ExploreRepository {
  async getModels(filters: ModelFilters, { page, limit }: PaginationOpts) {
    const where: any = { isPublished: true };
    if (filters.industrySlug) where.industrySlug = filters.industrySlug;
    if (filters.builtBy) where.builtBy = { contains: filters.builtBy, mode: 'insensitive' };
    if (filters.isFree !== undefined) where.isFree = filters.isFree;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search.toLowerCase()] } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.aIModel.findMany({
        where,
        include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aIModel.count({ where }),
    ]);

    return { items, total };
  }

  async getModelById(id: string) {
    return prisma.aIModel.findUnique({
      where: { id },
      include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
    });
  }

  async getAgentById(id: string) {
    return prisma.aIAgent.findUnique({
      where: { id },
      include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
    });
  }

  async getAgents(filters: ModelFilters, { page, limit }: PaginationOpts) {
    const where: any = { isPublished: true };
    if (filters.industrySlug) where.industrySlug = filters.industrySlug;
    if (filters.builtBy) where.builtBy = { contains: filters.builtBy, mode: 'insensitive' };
    if (filters.isFree !== undefined) where.isFree = filters.isFree;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.aIAgent.findMany({
        where,
        include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aIAgent.count({ where }),
    ]);

    return { items, total };
  }

  async getApps(filters: AppFilters, { page, limit }: PaginationOpts) {
    const where: any = { isPublished: true };
    if (filters.industrySlug) where.industrySlug = filters.industrySlug;
    if (filters.isFree !== undefined) where.isFree = filters.isFree;
    if (filters.whoUsesIt) where.whoUsesIt = { contains: filters.whoUsesIt, mode: 'insensitive' };
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.aIApp.findMany({
        where,
        include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aIApp.count({ where }),
    ]);

    return { items, total };
  }

}
