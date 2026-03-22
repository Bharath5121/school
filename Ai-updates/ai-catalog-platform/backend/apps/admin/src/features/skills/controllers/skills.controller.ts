import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { SkillsService } from '../services/skills.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class SkillsController {
  private service = new SkillsService();

  getSkills = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAll();
    res.json(ApiResponse.success(data));
  });

  getSkill = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getById(req.params.id);
    if (!data) { res.status(404).json(ApiResponse.error('Skill not found')); return; }
    res.json(ApiResponse.success(data));
  });

  createSkill = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.create(req.body);
    res.status(201).json(ApiResponse.success(data, 'Skill created'));
  });

  updateSkill = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.update(req.params.id, req.body);
    res.json(ApiResponse.success(data, 'Skill updated'));
  });

  deleteSkill = asyncHandler(async (req: Request, res: Response) => {
    await this.service.delete(req.params.id);
    res.json(ApiResponse.success(null, 'Skill deleted'));
  });
}
