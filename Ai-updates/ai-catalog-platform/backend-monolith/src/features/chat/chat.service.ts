import { ChatRepository } from './chat.repository';
import { redis } from '../../config/redis';
import { AppError } from '../../shared/errors/AppError';

const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 20;

export class ChatService {
  private repo = new ChatRepository();

  async getMessages(channel: string, limit: number, after?: string) {
    const messages = await this.repo.getMessages(channel, limit, after);
    return messages.reverse();
  }

  async sendMessage(userId: string, channel: string, message: string) {
    const key = `chat:rate:${userId}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);

    if (count > RATE_LIMIT_MAX) {
      throw new AppError('Rate limit exceeded. Please wait before sending more messages.', 429);
    }

    return this.repo.createMessage(userId, channel, message.trim());
  }
}
