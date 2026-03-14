import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { GuidesService } from '../services/guides.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new GuidesService();

export class GuidesController {
  static listGuides = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { items, total } = await service.listGuides(
      req.query.industry as string,
      req.query.difficulty as string,
      req.query.search as string,
      page,
      limit,
    );
    res.json(ApiResponse.success(items, 'Guides retrieved', { page, limit, total }));
  });

  static getGuide = asyncHandler(async (req: Request, res: Response) => {
    const guide = await service.getGuide(req.params.id);
    res.json(ApiResponse.success(guide, 'Guide details'));
  });

  static listPrompts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { items, total } = await service.listPrompts(
      req.query.industry as string,
      req.query.category as string,
      page,
      limit,
    );
    res.json(ApiResponse.success(items, 'Prompts retrieved', { page, limit, total }));
  });
}
