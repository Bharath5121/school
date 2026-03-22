import { prisma } from '../../../config/database';

export class ChapterRepository {
  async findAllWithTopics() {
    return prisma.basicsChapter.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        icon: true,
        sortOrder: true,
        topics: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            slug: true,
            title: true,
            tagline: true,
            icon: true,
            color: true,
            sortOrder: true,
            difficulty: true,
            xp: true,
            _count: { select: { videos: true, articles: true } },
          },
        },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.basicsChapter.count({ where: { isPublished: true } });
  }
}
