import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { industryAdminService } from '../services/industry-admin.service';

export class IndustryAdminController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await industryAdminService.create(req.body);
    res.status(201).json(ApiResponse.success(result, 'Industry created'));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const result = await industryAdminService.update(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Industry updated'));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await industryAdminService.delete(req.params.id);
    res.json(ApiResponse.success(null, 'Industry deleted'));
  });
}

export const industryAdminController = new IndustryAdminController();
