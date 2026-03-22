import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { BuddyService } from '../services/buddy.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class BuddyController {
  private service = new BuddyService();

  getConversations = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getConversations(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getConversation = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getConversation(req.params.id, req.user!.userId);
    if (!data) { res.status(404).json(ApiResponse.error('Conversation not found')); return; }
    res.json(ApiResponse.success(data));
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getMessages(req.params.id, req.user!.userId);
    if (!data) { res.status(404).json(ApiResponse.error('Conversation not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createConversation = asyncHandler(async (req: Request, res: Response) => {
    const { title, context } = req.body;
    const data = await this.service.createConversation(req.user!.userId, title, context);
    res.status(201).json(ApiResponse.success(data));
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json(ApiResponse.error('Message content is required')); return; }
    const data = await this.service.sendMessage(req.params.id, req.user!.userId, content.trim());
    if (!data) { res.status(404).json(ApiResponse.error('Conversation not found')); return; }
    res.json(ApiResponse.success(data));
  });

  updateTitle = asyncHandler(async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title?.trim()) { res.status(400).json(ApiResponse.error('Title is required')); return; }
    await this.service.updateTitle(req.params.id, req.user!.userId, title.trim());
    res.json(ApiResponse.success(null, 'Title updated'));
  });

  deleteConversation = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteConversation(req.params.id, req.user!.userId);
    res.json(ApiResponse.success(null, 'Conversation deleted'));
  });
}
