import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { discoveryService } from '../services/discovery.service';

class DiscoveryController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await discoveryService.listPublished(req.query as any);
    res.json(ApiResponse.success(result.items, 'Discoveries', {
      page: result.page, limit: result.limit, total: result.total,
    }));
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const item = await discoveryService.getBySlug(req.params.slug);
    res.json(ApiResponse.success(item));
  });

  getChatMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await discoveryService.getChatMessages(req.params.slug);
    res.json(ApiResponse.success(messages));
  });

  postChatMessage = asyncHandler(async (req: Request, res: Response) => {
    const msg = await discoveryService.postChatMessage(
      req.params.slug,
      req.user!.userId,
      req.body.message,
    );
    res.status(201).json(ApiResponse.success(msg, 'Message sent'));
  });
}

export const discoveryController = new DiscoveryController();
