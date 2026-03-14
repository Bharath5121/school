import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { CareersService } from '../services/careers.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

const service = new CareersService();

export class CareersController {
  static getCareerPaths = asyncHandler(async (req: Request, res: Response) => {
    const paths = await service.getCareerPaths(req.params.industrySlug);
    res.json(ApiResponse.success(paths, 'Career paths retrieved'));
  });

  static getJobs = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await service.getJobs(req.params.industrySlug);
    res.json(ApiResponse.success(jobs, 'Career jobs retrieved'));
  });

  static getJobById = asyncHandler(async (req: Request, res: Response) => {
    const job = await service.getJobById(req.params.id);
    res.json(ApiResponse.success(job, 'Job details'));
  });

  static getSkills = asyncHandler(async (req: Request, res: Response) => {
    const skills = await service.getSkills(req.params.industrySlug);
    res.json(ApiResponse.success(skills, 'Skills retrieved'));
  });
}
