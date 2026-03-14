import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { DetailService } from '../services/detail.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class DetailController {
  private service = new DetailService();

  getAllContent = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getIndustryDetail(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });

  getModels = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getModels(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });

  getAgents = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getAgents(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });

  getApps = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getApps(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });
}
