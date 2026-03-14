import { onboardingRepository } from '../repositories/onboarding.repository';
import { OnboardingData } from '../types/onboarding.types';
import { logger } from '@/lib/logger';

export class OnboardingService {
  async completeOnboarding(data: OnboardingData) {
    try {
      return await onboardingRepository.completeOnboarding(data);
    } catch (error) {
      logger.error('Error in OnboardingService:', error);
      throw error;
    }
  }
}

export const onboardingService = new OnboardingService();
