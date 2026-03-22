import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { TrendingService } from '../services/trending.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class TrendingController {
  private service = new TrendingService();

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getCategories();
    res.json(ApiResponse.success(data));
  });

  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCategoryBySlug(req.params.slug);
    if (!data) { res.status(404).json(ApiResponse.error('Category not found')); return; }
    res.json(ApiResponse.success(data));
  });

  getByIndustry = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAppsByIndustry(req.params.slug);
    res.json(ApiResponse.success(data));
  });

  getMyApps = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getMyApps(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getAppDetail = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAppBySlug(req.params.slug);
    if (!data) { res.status(404).json(ApiResponse.error('App not found')); return; }
    res.json(ApiResponse.success(data));
  });
}
