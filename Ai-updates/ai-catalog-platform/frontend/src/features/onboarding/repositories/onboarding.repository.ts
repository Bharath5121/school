import { apiClient } from '../../../lib/api-client';

export class OnboardingRepository {
  async completeOnboarding(data: any) {
    const response: any = await apiClient.post('/onboarding', data);
    return response.data;
  }
}

export const onboardingRepository = new OnboardingRepository();
