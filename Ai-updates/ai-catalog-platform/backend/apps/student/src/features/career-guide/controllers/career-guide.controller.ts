import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { CareerGuideService } from '../services/career-guide.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class CareerGuideController {
  private service = new CareerGuideService();

  getMyGuides = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getMyGuides(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getGuideDetail = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getGuideById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Guide not found')); return; }
    res.json(ApiResponse.success(data));
  });
}
