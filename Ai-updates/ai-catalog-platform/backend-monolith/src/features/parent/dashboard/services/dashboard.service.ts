import { ParentDashboardRepository } from '../repositories/dashboard.repository';

export class DashboardService {
  private repo = new ParentDashboardRepository();

  async getParentSummary(userId: string) {
    const [parent, children, unreadMessages] = await Promise.all([
      this.repo.getParentWithProfile(userId),
      this.repo.getLinkedChildrenWithStats(userId),
      this.repo.getUnreadNotificationCount(userId),
    ]);

    return {
      parent: { name: parent?.name ?? 'Parent' },
      children,
      unreadMessages,
    };
  }
}
