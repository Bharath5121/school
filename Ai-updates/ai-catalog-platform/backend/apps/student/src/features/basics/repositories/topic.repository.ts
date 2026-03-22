import { prisma } from '../../../config/database';
import type { TopicListDto } from '../dtos/topic-list.dto';

export class TopicRepository {
  async findAll(): Promise<TopicListDto[]> {
    return prisma.basicsTopic.findMany({
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
        chapterId: true,
        videoUrl: true,
        notebookLmUrl: true,
        architectureDescription: true,
        _count: { select: { videos: true, articles: true, links: true } },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.basicsTopic.count({ where: { isPublished: true } });
  }
}
