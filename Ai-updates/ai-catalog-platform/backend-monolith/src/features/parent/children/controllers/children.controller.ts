import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { ChildrenService } from '../services/children.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class ChildrenController {
  private service = new ChildrenService();

  list = asyncHandler(async (req: Request, res: Response) => {
    const children = await this.service.getLinkedChildren(req.user!.userId);
    res.status(200).json(ApiResponse.success(children));
  });

  link = asyncHandler(async (req: Request, res: Response) => {
    const { childName, childEmail } = req.body;
    const child = await this.service.linkChild(req.user!.userId, childName, childEmail);
    res.status(201).json(ApiResponse.success(child, 'Child linked successfully'));
  });

  unlink = asyncHandler(async (req: Request, res: Response) => {
    await this.service.unlinkChild(req.user!.userId, req.params.childId);
    res.status(200).json(ApiResponse.success(null, 'Child unlinked successfully'));
  });
}
