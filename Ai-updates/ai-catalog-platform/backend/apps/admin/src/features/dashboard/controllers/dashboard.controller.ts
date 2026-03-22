import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  getSummary = asyncHandler(async (_req: Request, res: Response) => {
    const summary = await dashboardService.getAdminSummary();
    res.json(ApiResponse.success(summary));
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    res.json(ApiResponse.success(stats));
  });
}

export const dashboardController = new DashboardController();
