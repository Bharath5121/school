import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

const service = new DashboardService();

export class DashboardController {
  static getOverview = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getOverview(req.user!.userId);
    res.status(200).json(ApiResponse.success(data));
  });
}
