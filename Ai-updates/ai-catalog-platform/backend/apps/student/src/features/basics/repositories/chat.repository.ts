import { prisma } from '../../../config/database';

export class BasicsTopicChatRepository {
  async findByTopicSlug(slug: string) {
    const topic = await prisma.basicsTopic.findUnique({ where: { slug }, select: { id: true } });
    if (!topic) return [];
    return prisma.basicsTopicChatMsg.findMany({
      where: { topicId: topic.id },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        message: true,
        response: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }

  async createMessage(topicSlug: string, userId: string, message: string) {
    const topic = await prisma.basicsTopic.findUnique({ where: { slug: topicSlug }, select: { id: true } });
    if (!topic) throw new Error('Topic not found');
    return prisma.basicsTopicChatMsg.create({
      data: { topicId: topic.id, userId, message },
      select: {
        id: true,
        message: true,
        response: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
      },
    });
  }
}
