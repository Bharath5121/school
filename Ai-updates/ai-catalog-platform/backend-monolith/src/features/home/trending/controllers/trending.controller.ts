import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { TrendingService } from '../services/trending.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new TrendingService();

export class TrendingController {
  static getTrending = asyncHandler(async (req: Request, res: Response) => {
    const timeframe = (req.query.timeframe as string) || 'today';
    const limit = parseInt(req.query.limit as string) || 10;

    const type = req.query.type as string | undefined;
    const items = await service.getTrending(timeframe, limit, type);
    res.json(ApiResponse.success(items, 'Trending items'));
  });

  static getWhatsNew = asyncHandler(async (req: Request, res: Response) => {
    const fields = req.query.fields ? (req.query.fields as string).split(',') : undefined;
    const contentType = req.query.type as string | undefined;
    const showAll = req.query.showAll === 'true';

    const data = await service.getWhatsNew(fields, contentType, showAll);
    res.json(ApiResponse.success(data, "What's new"));
  });
}
