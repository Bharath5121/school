import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { BasicsTopicChatService } from '../services/chat.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class BasicsTopicChatController {
  private service = new BasicsTopicChatService();

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await this.service.getMessages(req.params.slug);
    res.json(ApiResponse.success(messages, 'Messages fetched'));
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.sendMessage(req.params.slug, userId, req.body.message);
    res.status(201).json(ApiResponse.success(result, 'Message sent'));
  });
}
