import { prisma } from '../../../config/database';

const CONVERSATION_SELECT = {
  id: true,
  userId: true,
  title: true,
  context: true,
  model: true,
  archived: true,
  createdAt: true,
  updatedAt: true,
};

const MESSAGE_SELECT = {
  id: true,
  conversationId: true,
  role: true,
  content: true,
  metadata: true,
  createdAt: true,
};

export class BuddyRepository {
  async getConversations(userId: string) {
    return prisma.buddyConversation.findMany({
      where: { userId, archived: false },
      select: {
        ...CONVERSATION_SELECT,
        messages: { select: MESSAGE_SELECT, orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    return prisma.buddyConversation.findFirst({
      where: { id, userId },
      select: CONVERSATION_SELECT,
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const convo = await prisma.buddyConversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!convo) return null;

    return prisma.buddyMessage.findMany({
      where: { conversationId },
      select: MESSAGE_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async createConversation(userId: string, title?: string, context?: string) {
    return prisma.buddyConversation.create({
      data: { userId, title: title || 'New Conversation', context },
      select: CONVERSATION_SELECT,
    });
  }

  async addMessage(conversationId: string, userId: string, role: 'USER' | 'ASSISTANT' | 'SYSTEM', content: string, metadata?: any) {
    const convo = await prisma.buddyConversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });
    if (!convo) return null;

    const message = await prisma.buddyMessage.create({
      data: { conversationId, role, content, metadata: metadata || {} },
      select: MESSAGE_SELECT,
    });

    await prisma.buddyConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async updateTitle(id: string, userId: string, title: string) {
    return prisma.buddyConversation.updateMany({
      where: { id, userId },
      data: { title },
    });
  }

  async archiveConversation(id: string, userId: string) {
    return prisma.buddyConversation.updateMany({
      where: { id, userId },
      data: { archived: true },
    });
  }

  async deleteConversation(id: string, userId: string) {
    const convo = await prisma.buddyConversation.findFirst({ where: { id, userId } });
    if (!convo) return null;
    return prisma.buddyConversation.delete({ where: { id } });
  }

  async getMessageCount(conversationId: string) {
    return prisma.buddyMessage.count({ where: { conversationId } });
  }
}
