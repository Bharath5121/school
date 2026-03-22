import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { TrendingService } from '../services/trending.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class TrendingController {
  private service = new TrendingService();

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllCategories();
    res.json(ApiResponse.success(data));
  });

  getCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCategoryById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Category not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createCategory(req.body);
    res.status(201).json(ApiResponse.success(data, 'Category created'));
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateCategory(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Category updated'));
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteCategory(req.params.id);
    res.json(ApiResponse.success(null, 'Category deleted'));
  });

  getApps = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllApps();
    res.json(ApiResponse.success(data));
  });

  getApp = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAppById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('App not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createApp = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createApp(req.body);
    res.status(201).json(ApiResponse.success(data, 'App created'));
  });

  updateApp = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateApp(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'App updated'));
  });

  deleteApp = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteApp(req.params.id);
    res.json(ApiResponse.success(null, 'App deleted'));
  });
}
