import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { CareerService } from '../services/career.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class CareerController {
  private service = new CareerService();

  getMyPaths = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getMyPaths(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getJobDetail = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getJobById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Job not found')); return; }
    res.json(ApiResponse.success(data));
  });
}
