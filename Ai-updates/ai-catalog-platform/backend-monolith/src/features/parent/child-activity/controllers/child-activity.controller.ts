import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { ChildActivityService } from '../services/child-activity.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class ChildActivityController {
  private service = new ChildActivityService();

  getOverview = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getOverview(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getNotebooks = asyncHandler(async (req: Request, res: Response) => {
    const timeframe = (req.query.timeframe as string) || 'week';
    const data = await this.service.getNotebooks(req.params.childId, timeframe);
    res.status(200).json(ApiResponse.success(data));
  });

  getActivity = asyncHandler(async (req: Request, res: Response) => {
    const timeframe = (req.query.timeframe as string) || 'week';
    const data = await this.service.getActivity(req.params.childId, timeframe);
    res.status(200).json(ApiResponse.success(data));
  });

  getSkills = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getSkills(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getCareer = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCareer(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getTimeSpent = asyncHandler(async (req: Request, res: Response) => {
    const timeframe = (req.query.timeframe as string) || 'week';
    const data = await this.service.getTimeSpent(req.params.childId, timeframe);
    res.status(200).json(ApiResponse.success(data));
  });

  getCompleted = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCompleted(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getStudentDashboard(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getChildInterests = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getChildInterests(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getChildSkillProgress = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getChildSkillProgress(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });

  getChildCareerStats = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getChildCareerStats(req.params.childId);
    res.status(200).json(ApiResponse.success(data));
  });
}
