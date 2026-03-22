import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { industryService } from '../services/industry.service';

export class IndustryController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await industryService.getAll();
    res.json(ApiResponse.success(data));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await industryService.getById(req.params.id);
    res.json(ApiResponse.success(data));
  });
}

export const industryController = new IndustryController();
