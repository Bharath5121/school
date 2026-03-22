import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { SkillsService } from '../services/skills.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class SkillsController {
  private service = new SkillsService();

  getMySkills = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getMySkills(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getSkillDetail = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getSkillById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Skill not found')); return; }
    res.json(ApiResponse.success(data));
  });
}
