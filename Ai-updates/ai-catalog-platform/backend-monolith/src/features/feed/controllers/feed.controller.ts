import { Request, Response } from 'express';
import { FeedService } from '../services/feed.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

export class FeedController {
  private service = new FeedService();

  create = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.createItem(req.body);
    res.status(201).json(ApiResponse.success(item));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.updateItem(req.params.id, req.body);
    res.status(200).json(ApiResponse.success(item));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteItem(req.params.id);
    res.status(200).json(ApiResponse.success(null, 'Feed item deleted'));
  });

  getOne = asyncHandler(async (req: Request, res: Response) => {
    const item = await this.service.getItem(req.params.id);
    res.status(200).json(ApiResponse.success(item));
  });

  getFeed = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.getFeed(req.query as any);
    res.status(200).json(ApiResponse.success(result.data, 'Success', {
      page: result.page,
      limit: result.limit,
      total: result.total
    }));
  });

  getTrending = asyncHandler(async (req: Request, res: Response) => {
    const items = await this.service.getTrending();
    res.status(200).json(ApiResponse.success(items));
  });

  getFields = asyncHandler(async (req: Request, res: Response) => {
    const fields = await this.service.getFields();
    res.status(200).json(ApiResponse.success(fields));
  });
}
