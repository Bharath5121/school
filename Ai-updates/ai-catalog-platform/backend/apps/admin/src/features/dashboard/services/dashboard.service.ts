import { dashboardRepository } from '../repositories/dashboard.repository';
import { cacheGet, cacheSet } from '../../../shared/utils/cache';
import { CacheKeys } from '../../../shared/utils/cache-keys';
import { APP_CONSTANTS } from '../../../config/constants';

export class DashboardService {
  async getAdminSummary() {
    const cached = await cacheGet<any>(CacheKeys.dashboard.summary());
    if (cached) return cached;

    const [roleBreakdown, recentUsers] = await Promise.all([
      dashboardRepository.getRoleBreakdown(),
      dashboardRepository.getRecentUsers(),
    ]);

    const roles: Record<string, number> = {};
    for (const r of roleBreakdown) {
      roles[r.role] = r._count.id;
    }
    const totalUsers = Object.values(roles).reduce((sum, n) => sum + n, 0);

    const summary = { platformHealth: 'All services operational', totalUsers, roles, recentUsers };
    await cacheSet(CacheKeys.dashboard.summary(), summary, APP_CONSTANTS.CACHE_TTL.MEDIUM);
    return summary;
  }

  async getStats() {
    const cached = await cacheGet<any>(CacheKeys.dashboard.stats());
    if (cached) return cached;

    const stats = await dashboardRepository.getStats();
    await cacheSet(CacheKeys.dashboard.stats(), stats, APP_CONSTANTS.CACHE_TTL.MEDIUM);
    return stats;
  }
}

export const dashboardService = new DashboardService();
