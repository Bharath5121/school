import { BasicsTopicChatRepository } from '../repositories/chat.repository';

export class BasicsTopicChatService {
  private repository = new BasicsTopicChatRepository();

  async getMessages(slug: string) {
    return this.repository.findByTopicSlug(slug);
  }

  async sendMessage(slug: string, userId: string, message: string) {
    return this.repository.createMessage(slug, userId, message);
  }
}
