import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { IndustryService } from '../services/industry.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class IndustryController {
  private service = new IndustryService();

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.listIndustries();
    res.status(200).json(ApiResponse.success(result));
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getIndustryMetadata(req.params.slug);
    if (!result) {
      res.status(404).json(ApiResponse.error('Industry not found'));
      return;
    }
    res.status(200).json(ApiResponse.success(result));
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getStats();
    res.status(200).json(ApiResponse.success(result));
  });

  getFieldStats = asyncHandler(async (req: Request, res: Response) => {
    const slugs = (req.query.fields as string || '').split(',').filter(Boolean);
    if (slugs.length === 0) {
      res.status(400).json(ApiResponse.error('fields query param required'));
      return;
    }
    const result = await this.service.getFieldStats(slugs);
    res.status(200).json(ApiResponse.success(result));
  });

  getLatestByField = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getLatestByField(req.params.slug);
    res.status(200).json(ApiResponse.success(result));
  });
}
