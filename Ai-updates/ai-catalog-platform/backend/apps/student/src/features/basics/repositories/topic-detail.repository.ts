import { prisma } from '../../../config/database';
import { MAX_ITEMS_PER_TOPIC } from '../constants/basics.constants';

export class TopicDetailRepository {
  async findBySlug(slug: string) {
    return prisma.basicsTopic.findUnique({
      where: { slug },
      include: {
        videos: { orderBy: { sortOrder: 'asc' }, take: MAX_ITEMS_PER_TOPIC },
        articles: { orderBy: { sortOrder: 'asc' }, take: MAX_ITEMS_PER_TOPIC },
        links: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findById(id: string) {
    return prisma.basicsTopic.findUnique({
      where: { id },
      include: {
        videos: { orderBy: { sortOrder: 'asc' }, take: MAX_ITEMS_PER_TOPIC },
        articles: { orderBy: { sortOrder: 'asc' }, take: MAX_ITEMS_PER_TOPIC },
        links: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }
}
