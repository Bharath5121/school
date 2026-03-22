import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { LabService } from '../services/lab.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class LabController {
  private service = new LabService();

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getCategories();
    res.json(ApiResponse.success(data));
  });

  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCategoryBySlug(req.params.slug);
    if (!data) { res.status(404).json(ApiResponse.error('Category not found')); return; }
    res.json(ApiResponse.success(data));
  });

  getItemBySlug = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getItemBySlug(req.params.slug);
    if (!data) { res.status(404).json(ApiResponse.error('Item not found')); return; }
    res.json(ApiResponse.success(data));
  });

  getChatMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await this.service.getChatMessages(req.params.slug);
    res.json(ApiResponse.success(messages));
  });

  sendChatMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.sendChatMessage(req.params.slug, userId, req.body.message);
    res.status(201).json(ApiResponse.success(result, 'Message sent'));
  });
}
