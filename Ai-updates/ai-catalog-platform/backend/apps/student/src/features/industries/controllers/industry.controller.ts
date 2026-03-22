import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { industryService } from '../services/industry.service';

export class IndustryController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await industryService.getAll();
    res.json(ApiResponse.success(data, 'Industries fetched'));
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await industryService.getBySlug(req.params.slug);
    res.json(ApiResponse.success(data, 'Industry fetched'));
  });
}

export const industryController = new IndustryController();
