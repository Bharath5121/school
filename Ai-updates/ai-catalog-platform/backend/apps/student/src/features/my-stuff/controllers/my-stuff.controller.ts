import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { MyStuffService } from '../services/my-stuff.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class MyStuffController {
  private service = new MyStuffService();

  getSavedItems = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getSavedItems(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  checkSaved = asyncHandler(async (req: Request, res: Response) => {
    const { contentType, contentId } = req.params;
    const saved = await this.service.isSaved(req.user!.userId, contentType, contentId);
    res.json(ApiResponse.success({ saved }));
  });

  saveItem = asyncHandler(async (req: Request, res: Response) => {
    const { contentType, contentId, title, url, metadata } = req.body;
    if (!contentType || !contentId || !title) {
      res.status(400).json(ApiResponse.error('contentType, contentId, and title are required'));
      return;
    }
    const item = await this.service.saveItem(req.user!.userId, { contentType, contentId, title, url, metadata });
    res.status(201).json(ApiResponse.success(item, 'Item saved'));
  });

  unsaveItem = asyncHandler(async (req: Request, res: Response) => {
    const { contentType, contentId } = req.params;
    await this.service.unsaveItem(req.user!.userId, contentType, contentId);
    res.json(ApiResponse.success(null, 'Item removed'));
  });

  getHistory = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const data = await this.service.getHistory(req.user!.userId, limit);
    res.json(ApiResponse.success(data));
  });

  trackView = asyncHandler(async (req: Request, res: Response) => {
    const { contentType, contentId, title, slug, icon, metadata } = req.body;
    if (!contentType || !contentId || !title) {
      res.status(400).json(ApiResponse.error('contentType, contentId, and title are required'));
      return;
    }
    const item = await this.service.trackView(req.user!.userId, { contentType, contentId, title, slug, icon, metadata });
    res.json(ApiResponse.success(item));
  });

  clearHistory = asyncHandler(async (req: Request, res: Response) => {
    await this.service.clearHistory(req.user!.userId);
    res.json(ApiResponse.success(null, 'History cleared'));
  });

  getCounts = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCounts(req.user!.userId);
    res.json(ApiResponse.success(data));
  });
}
