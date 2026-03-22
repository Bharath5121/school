import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { discoveryService } from '../services/discovery.service';

class DiscoveryController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await discoveryService.list(req.query as any);
    res.json(ApiResponse.success(result.items, 'Success', {
      page: result.page, limit: result.limit, total: result.total,
    }));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await discoveryService.getById(req.params.id);
    res.json(ApiResponse.success(item));
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const item = await discoveryService.create(req.body);
    res.status(201).json(ApiResponse.success(item, 'Discovery created'));
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const item = await discoveryService.update(req.params.id, req.body);
    res.json(ApiResponse.success(item, 'Discovery updated'));
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await discoveryService.delete(req.params.id);
    res.json(ApiResponse.success(null, 'Discovery deleted'));
  });

  togglePublish = asyncHandler(async (req: Request, res: Response) => {
    const item = await discoveryService.togglePublish(req.params.id);
    res.json(ApiResponse.success(item, 'Publish status toggled'));
  });

  addLink = asyncHandler(async (req: Request, res: Response) => {
    const link = await discoveryService.addLink(req.params.id, req.body);
    res.status(201).json(ApiResponse.success(link, 'Link added'));
  });

  removeLink = asyncHandler(async (req: Request, res: Response) => {
    await discoveryService.removeLink(req.params.linkId);
    res.json(ApiResponse.success(null, 'Link removed'));
  });
}

export const discoveryController = new DiscoveryController();
