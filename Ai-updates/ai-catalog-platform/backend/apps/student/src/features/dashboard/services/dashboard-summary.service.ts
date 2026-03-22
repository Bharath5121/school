import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardUser } from '../types/dashboard.types';

const repo = new DashboardRepository();

export class DashboardSummaryService {
  async getSummary(userId: string): Promise<{ user: DashboardUser }> {
    const dbUser = await repo.getUser(userId);

    const interests: string[] = dbUser?.profile?.interests?.map((i: { fieldName: string }) => i.fieldName) ?? [];

    return {
      user: {
        name: dbUser?.name ?? 'Student',
        interests,
        gradeLevel: dbUser?.profile?.gradeLevel ?? null,
      },
    };
  }
}
