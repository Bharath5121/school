import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { SkillService } from '../services/skill.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new SkillService();

export class SkillController {
  static getProgress = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const progress = await service.getProgress(userId);
    res.json(ApiResponse.success(progress, 'Skill progress retrieved'));
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { skillId } = req.params;
    const { status } = req.body;

    const updated = await service.updateStatus(userId, skillId, status);
    res.json(ApiResponse.success(updated, 'Skill status updated'));
  });

  static getSummary = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const summary = await service.getSummary(userId);
    res.json(ApiResponse.success(summary, 'Skill summary'));
  });
}
