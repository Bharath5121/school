import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  private repo = new NotificationRepository();

  async getNotifications(parentId: string, page = 1, limit = 20) {
    return this.repo.getNotesForParent(parentId, page, limit);
  }

  async getUnreadCount(parentId: string) {
    const count = await this.repo.getUnreadCount(parentId);
    return { unreadCount: count };
  }

  async markAsRead(noteId: string, parentId: string) {
    await this.repo.markAsRead(noteId, parentId);
  }
}
