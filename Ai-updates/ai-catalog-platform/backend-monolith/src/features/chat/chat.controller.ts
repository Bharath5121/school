import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const service = new ChatService();

export class ChatController {
  getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { channel, limit, after } = req.query as any;
    const data = await service.getMessages(
      channel || 'general',
      parseInt(limit) || 50,
      after as string | undefined,
    );
    res.json(ApiResponse.success(data));
  });

  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { channel, message } = req.body;
    const data = await service.sendMessage(req.user!.userId, channel || 'general', message);
    res.status(201).json(ApiResponse.success(data, 'Message sent'));
  });
}
