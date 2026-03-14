import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { HistoryService } from '../services/history.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new HistoryService();

export class HistoryController {
  static list = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const timeframe = (req.query.period ?? req.query.timeframe) as string | undefined;

    const { items, total } = await service.list(userId, page, limit, timeframe);
    res.json(ApiResponse.success(items, 'History retrieved', { page, limit, total }));
  });

  static track = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { feedItemId, timeSpent } = req.body;

    const entry = await service.track(userId, feedItemId, timeSpent || 0);
    res.json(ApiResponse.success(entry, 'Reading tracked'));
  });

  static stats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const stats = await service.stats(userId);
    res.json(ApiResponse.success(stats, 'Reading stats'));
  });

  static clear = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await service.clear(userId);
    res.json(ApiResponse.success(null, 'History cleared'));
  });
}
