import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class DashboardController {
  private service = new DashboardService();
  getSummary = asyncHandler(async (_req: Request, res: Response) => {
    const summary = await this.service.getAdminSummary();
    res.status(200).json(ApiResponse.success(summary));
  });
}
