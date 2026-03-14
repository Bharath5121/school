import { prisma } from '../../config/database';

export class ChatRepository {
  async getMessages(channel: string, limit: number, after?: string) {
    return prisma.classChat.findMany({
      where: {
        channel,
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }

  async createMessage(userId: string, channel: string, message: string) {
    return prisma.classChat.create({
      data: { userId, channel, message },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });
  }
}
