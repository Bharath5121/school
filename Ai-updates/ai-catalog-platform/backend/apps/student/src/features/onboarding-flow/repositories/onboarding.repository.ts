import { prisma } from '../../../config/database';

export class OnboardingRepository {
  async getStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompleted: true,
        selectedIndustries: {
          select: {
            industrySlug: true,
            industry: { select: { name: true, slug: true, icon: true, color: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return user;
  }

  async saveSelections(userId: string, industrySlugs: string[]) {
    await prisma.$transaction(async (tx) => {
      await tx.userIndustrySelection.deleteMany({ where: { userId } });

      if (industrySlugs.length > 0) {
        await tx.userIndustrySelection.createMany({
          data: industrySlugs.map((slug) => ({ userId, industrySlug: slug })),
          skipDuplicates: true,
        });
      }

      await tx.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      });
    });
  }

  async getAvailableIndustries() {
    return prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { name: true, slug: true, icon: true, color: true, description: true },
    });
  }
}
