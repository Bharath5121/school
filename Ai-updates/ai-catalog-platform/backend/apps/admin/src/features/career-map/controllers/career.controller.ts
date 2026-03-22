import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { CareerService } from '../services/career.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class CareerController {
  private service = new CareerService();

  getPaths = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllPaths();
    res.json(ApiResponse.success(data));
  });

  getPath = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getPathById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Career path not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createPath = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createPath(req.body);
    res.status(201).json(ApiResponse.success(data, 'Career path created'));
  });

  updatePath = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updatePath(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Career path updated'));
  });

  deletePath = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deletePath(req.params.id);
    res.json(ApiResponse.success(null, 'Career path deleted'));
  });

  getJobs = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllJobs();
    res.json(ApiResponse.success(data));
  });

  getJob = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getJobById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Career job not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createJob = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createJob(req.body);
    res.status(201).json(ApiResponse.success(data, 'Career job created'));
  });

  updateJob = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateJob(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Career job updated'));
  });

  deleteJob = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteJob(req.params.id);
    res.json(ApiResponse.success(null, 'Career job deleted'));
  });
}
