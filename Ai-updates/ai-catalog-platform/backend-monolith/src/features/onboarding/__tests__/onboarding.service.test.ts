jest.mock('../../../config/database', () => ({
  prisma: { $transaction: jest.fn() },
}));

jest.mock('../repositories/onboarding.repository', () => ({
  onboardingRepository: {
    completeOnboarding: jest.fn(),
  },
}));

import { OnboardingService } from '../services/onboarding.service';
import { onboardingRepository } from '../repositories/onboarding.repository';

const mockedRepo = onboardingRepository as jest.Mocked<typeof onboardingRepository>;

describe('OnboardingService', () => {
  let service: OnboardingService;

  beforeEach(() => {
    service = new OnboardingService();
  });

  describe('onboard', () => {
    it('delegates to the repository with userId and data', async () => {
      const userId = 'user-uuid-123';
      const data = {
        role: 'STUDENT',
        interests: ['ai-ml', 'robotics'],
        gradeLevel: '10th',
        parentEmail: 'parent@test.com',
        stream: 'Science',
        learningStyle: 'visual',
      };
      const expectedProfile = {
        userId,
        gradeLevel: '10th',
        onboardingCompleted: true,
      };

      mockedRepo.completeOnboarding.mockResolvedValue(expectedProfile);

      const result = await service.onboard(userId, data);

      expect(mockedRepo.completeOnboarding).toHaveBeenCalledWith(userId, data);
      expect(mockedRepo.completeOnboarding).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedProfile);
    });

    it('passes minimal data when optional fields are omitted', async () => {
      const userId = 'user-uuid-456';
      const data = { role: 'PARENT' };

      mockedRepo.completeOnboarding.mockResolvedValue({ userId, onboardingCompleted: true });

      const result = await service.onboard(userId, data);

      expect(mockedRepo.completeOnboarding).toHaveBeenCalledWith(userId, data);
      expect(result.onboardingCompleted).toBe(true);
    });

    it('propagates repository errors', async () => {
      mockedRepo.completeOnboarding.mockRejectedValue(new Error('DB transaction failed'));

      await expect(service.onboard('user-1', { role: 'STUDENT' }))
        .rejects
        .toThrow('DB transaction failed');
    });
  });
});
