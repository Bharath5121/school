import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { OnboardingService } from '../services/onboarding.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';

export class OnboardingController {
  private service = new OnboardingService();

  getStatus = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getStatus(req.user!.userId);
    res.json(ApiResponse.success(data));
  });

  getIndustries = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAvailableIndustries();
    res.json(ApiResponse.success(data));
  });

  completeOnboarding = asyncHandler(async (req: Request, res: Response) => {
    const { industrySlugs } = req.body;
    if (!Array.isArray(industrySlugs) || industrySlugs.length === 0) {
      res.status(400).json(ApiResponse.error('Please select at least one industry'));
      return;
    }
    const data = await this.service.completeOnboarding(req.user!.userId, industrySlugs);
    res.json(ApiResponse.success(data, 'Onboarding completed'));
  });
}
