import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { CareerGuideService } from '../services/career-guide.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class CareerGuideController {
  private service = new CareerGuideService();

  getGuides = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAll();
    res.json(ApiResponse.success(data));
  });

  getGuide = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Guide not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createGuide = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(ApiResponse.success(data, 'Guide created'));
  });

  updateGuide = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Guide updated'));
  });

  deleteGuide = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.json(ApiResponse.success(null, 'Guide deleted'));
  });
}
