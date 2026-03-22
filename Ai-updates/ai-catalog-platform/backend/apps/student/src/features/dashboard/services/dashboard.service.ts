import { DashboardAggregatorService } from './dashboard-aggregator.service';
import { DashboardData } from '../types/dashboard.types';

const aggregator = new DashboardAggregatorService();

export class DashboardService {
  async getOverview(userId: string): Promise<DashboardData> {
    return aggregator.aggregate(userId);
  }
}
