import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { DashboardSummaryService } from '../services/dashboard-summary.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

const service = new DashboardSummaryService();

export class DashboardSummaryController {
  static getSummary = asyncHandler(async (req: Request, res: Response) => {
    const summary = await service.getSummary(req.user!.userId);
    res.status(200).json(ApiResponse.success(summary));
  });
}
