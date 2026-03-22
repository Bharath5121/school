import { OnboardingRepository } from '../repositories/onboarding.repository';

export class OnboardingService {
  private repo = new OnboardingRepository();

  async getStatus(userId: string) {
    return this.repo.getStatus(userId);
  }

  async completeOnboarding(userId: string, industrySlugs: string[]) {
    await this.repo.saveSelections(userId, industrySlugs);
    return this.repo.getStatus(userId);
  }

  async getAvailableIndustries() {
    return this.repo.getAvailableIndustries();
  }
}
