import { onboardingRepository } from '../repositories/onboarding.repository';

export class OnboardingService {
  async onboard(userId: string, data: any) {
    return onboardingRepository.completeOnboarding(userId, data);
  }
}

export const onboardingService = new OnboardingService();
