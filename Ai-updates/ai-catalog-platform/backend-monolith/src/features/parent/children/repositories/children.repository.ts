import { prisma } from '../../../../config/database';

export class ChildrenRepository {
  async getLinkedChildren(parentId: string) {
    const links = await (prisma as any).parentChildLink.findMany({
      where: { parentId },
      include: {
        child: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                gradeLevel: true,
                avatarUrl: true,
                interests: { select: { fieldName: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return links.map((l: any) => ({
      id: l.child.id,
      name: l.child.name,
      email: l.child.email,
      gradeLevel: l.child.profile?.gradeLevel ?? null,
      avatarUrl: l.child.profile?.avatarUrl ?? null,
      interests: l.child.profile?.interests?.map((i: any) => i.fieldName) ?? [],
      linkedAt: l.createdAt,
    }));
  }

  async linkChild(parentId: string, childId: string) {
    return (prisma as any).parentChildLink.create({
      data: { parentId, childId },
    });
  }

  async unlinkChild(parentId: string, childId: string) {
    return (prisma as any).parentChildLink.delete({
      where: { parentId_childId: { parentId, childId } },
    });
  }

  async findStudentByNameAndEmail(name: string, email: string) {
    return (prisma as any).user.findFirst({
      where: {
        email,
        role: 'STUDENT',
        deletedAt: null,
        ...(name ? { name: { equals: name, mode: 'insensitive' } } : {}),
      },
      select: { id: true, name: true, email: true },
    });
  }

  async linkExists(parentId: string, childId: string): Promise<boolean> {
    const link = await (prisma as any).parentChildLink.findUnique({
      where: { parentId_childId: { parentId, childId } },
    });
    return !!link;
  }
}
