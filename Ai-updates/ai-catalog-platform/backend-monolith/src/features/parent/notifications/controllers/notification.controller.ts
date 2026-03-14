import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class NotificationController {
  private service = new NotificationService();

  list = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await this.service.getNotifications(req.user!.userId, page, limit);
    res.status(200).json(ApiResponse.success(data.notes, 'Success', { page, limit, total: data.total }));
  });

  unreadCount = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getUnreadCount(req.user!.userId);
    res.status(200).json(ApiResponse.success(data));
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    await this.service.markAsRead(req.params.noteId, req.user!.userId);
    res.status(200).json(ApiResponse.success(null, 'Marked as read'));
  });
}
