import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { ContentBookmarkService } from '../services/content-bookmark.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new ContentBookmarkService();

export class ContentBookmarkController {
  static list = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const contentType = req.query.contentType as string | undefined;
    const items = await service.list(userId, contentType);
    res.json(ApiResponse.success(items, 'Content bookmarks retrieved'));
  });

  static add = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentType, contentId, title, url, metadata } = req.body;
    const bookmark = await service.add(userId, { contentType, contentId, title, url, metadata });
    res.status(201).json(ApiResponse.success(bookmark, 'Content bookmarked'));
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentType, contentId } = req.params;
    await service.remove(userId, contentType, contentId);
    res.json(ApiResponse.success(null, 'Content bookmark removed'));
  });

  static check = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentType } = req.query as { contentType: string };
    const ids = ((req.query.ids as string) || '').split(',').filter(Boolean);
    const savedSet = await service.check(userId, contentType, ids);
    res.json(ApiResponse.success(Array.from(savedSet), 'Checked'));
  });
}
