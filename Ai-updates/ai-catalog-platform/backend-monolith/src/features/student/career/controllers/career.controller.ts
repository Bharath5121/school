import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { CareerService } from '../services/career.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new CareerService();

export class CareerController {
  static getExplored = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const explored = await service.getExplored(userId);
    res.json(ApiResponse.success(explored, 'Career exploration data'));
  });

  static markExplored = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { jobId } = req.params;

    const entry = await service.markExplored(userId, jobId);
    res.json(ApiResponse.success(entry, 'Career job marked as explored'));
  });

  static removeExplored = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { jobId } = req.params;
    await service.removeExplored(userId, jobId);
    res.json(ApiResponse.success(null, 'Career job unmarked'));
  });

  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const stats = await service.getStats(userId);
    res.json(ApiResponse.success(stats, 'Career exploration stats'));
  });
}
