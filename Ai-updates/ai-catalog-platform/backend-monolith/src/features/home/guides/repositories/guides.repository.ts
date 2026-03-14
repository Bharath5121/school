import { prisma } from '../../../../config/database';

export class GuidesRepository {
  async findGuides(industrySlug?: string, difficulty?: string, search?: string, page = 1, limit = 20) {
    const where: any = { isPublished: true };
    if (industrySlug) where.industrySlug = industrySlug;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.guide.findMany({
        where,
        include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.guide.count({ where }),
    ]);

    return { items, total };
  }

  async findGuideById(id: string) {
    return prisma.guide.findUnique({
      where: { id },
      include: { industry: { select: { name: true, slug: true, icon: true, color: true } } },
    });
  }

  async findPrompts(industrySlug?: string, category?: string, page = 1, limit = 20) {
    const where: any = { isPublished: true };
    if (industrySlug) where.industrySlug = industrySlug;
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      prisma.promptTemplate.findMany({
        where,
        include: { industry: { select: { name: true, slug: true, icon: true } } },
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.promptTemplate.count({ where }),
    ]);

    return { items, total };
  }
}
