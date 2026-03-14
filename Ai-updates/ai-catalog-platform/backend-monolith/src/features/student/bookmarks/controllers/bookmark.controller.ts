import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { BookmarkService } from '../services/bookmark.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new BookmarkService();

export class BookmarkController {
  static list = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const contentType = req.query.contentType as string | undefined;

    const { items, total } = await service.list(userId, page, limit, contentType);
    res.json(ApiResponse.success(items, 'Bookmarks retrieved', { page, limit, total }));
  });

  static add = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { feedItemId } = req.body;

    const bookmark = await service.add(userId, feedItemId);
    res.status(201).json(ApiResponse.success(bookmark, 'Bookmarked'));
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { itemId } = req.params;

    await service.remove(userId, itemId);
    res.json(ApiResponse.success(null, 'Bookmark removed'));
  });
}
