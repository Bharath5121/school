import { prisma } from '../../../config/database';

// DB table users.user_interests uses field_name (not category_slug); profiles may vary
export class OnboardingRepository {
  async completeOnboarding(userId: string, data: any): Promise<any> {
    return (prisma as any).$transaction(async (tx: any) => {
      const currentUser = await tx.user.findUnique({ where: { id: userId }, select: { role: true } });
      const hasParentLinks = currentUser?.role === 'PARENT'
        ? await tx.parentChildLink.count({ where: { parentId: userId } })
        : 0;

      const effectiveRole = hasParentLinks > 0 ? 'PARENT' : (data.role || currentUser?.role || 'STUDENT');
      await tx.user.update({
        where: { id: userId },
        data: { role: effectiveRole }
      });

      // 2. Refresh interests
      await tx.$executeRawUnsafe(
        'DELETE FROM users.user_interests WHERE user_id = $1',
        userId
      );
      
      if (data.interests && data.interests.length > 0) {
        for (const fieldName of data.interests) {
          await tx.$executeRawUnsafe(
            `INSERT INTO users.user_interests (user_id, field_name, created_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user_id, field_name) DO NOTHING`,
            userId,
            fieldName
          );
        }
      }

      // 3. Update profile and mark onboarding as completed
      const profileData: any = {
        gradeLevel: data.gradeLevel?.trim() || null,
        parentEmail: data.parentEmail?.trim() || null,
        stream: data.stream?.trim() || null,
        learningStyle: data.learningStyle || null,
        onboardingCompleted: true,
        updatedAt: new Date()
      };

      return await tx.profile.update({
        where: { userId },
        data: profileData
      });
    });
  }
}

export const onboardingRepository = new OnboardingRepository();
