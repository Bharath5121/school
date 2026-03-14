import { Request, Response } from 'express';
import { onboardingService } from '../services/onboarding.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { asyncHandler } from '../../../shared/utils/asyncHandler';

export class OnboardingController {
  onboard = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await onboardingService.onboard(userId, req.body);
    res.status(200).json(ApiResponse.success(profile, 'Onboarding completed successfully'));
  });
}

export const onboardingController = new OnboardingController();
