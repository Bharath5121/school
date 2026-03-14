import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { ExploreService } from '../services/explore.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new ExploreService();

export class ExploreController {
  static getModels = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      industrySlug: req.query.industry as string,
      builtBy: req.query.builtBy as string,
      isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
      search: req.query.search as string,
    };

    const { items, total } = await service.getModels(filters, page, limit);
    res.json(ApiResponse.success(items, 'Models retrieved', { page, limit, total }));
  });

  static getModelById = asyncHandler(async (req: Request, res: Response) => {
    const model = await service.getModelById(req.params.id);
    res.json(ApiResponse.success(model, 'Model details'));
  });

  static getAgentById = asyncHandler(async (req: Request, res: Response) => {
    const agent = await service.getAgentById(req.params.id);
    res.json(ApiResponse.success(agent, 'Agent details'));
  });

  static getAgents = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      industrySlug: req.query.industry as string,
      builtBy: req.query.builtBy as string,
      isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
      search: req.query.search as string,
    };

    const { items, total } = await service.getAgents(filters, page, limit);
    res.json(ApiResponse.success(items, 'Agents retrieved', { page, limit, total }));
  });

  static getApps = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters = {
      industrySlug: req.query.industry as string,
      isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
      whoUsesIt: req.query.whoUsesIt as string,
      search: req.query.search as string,
    };

    const { items, total } = await service.getApps(filters, page, limit);
    res.json(ApiResponse.success(items, 'Apps retrieved', { page, limit, total }));
  });

}
