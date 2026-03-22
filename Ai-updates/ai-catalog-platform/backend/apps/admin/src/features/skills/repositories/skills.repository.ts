import { prisma } from '../../../config/database';
import type { CreateSkillDto, UpdateSkillDto } from '../dtos/skills.dto';

const SKILL_SELECT = {
  id: true, name: true, description: true, industrySlug: true,
  level: true, whyItMatters: true, learnUrl: true, notebookLmUrl: true,
  timeToLearn: true, category: true, sortOrder: true,
  createdAt: true, updatedAt: true,
} as const;

export class SkillsRepository {
  async findAll() {
    return prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: { ...SKILL_SELECT, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async findById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
      select: { ...SKILL_SELECT, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async create(data: CreateSkillDto) {
    const payload: any = { ...data };
    if (payload.learnUrl === '') payload.learnUrl = null;
    if (payload.notebookLmUrl === '') payload.notebookLmUrl = null;
    return prisma.skill.create({
      data: payload,
      select: { ...SKILL_SELECT, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async update(id: string, data: UpdateSkillDto) {
    const payload: any = { ...data };
    if (payload.learnUrl === '') payload.learnUrl = null;
    if (payload.notebookLmUrl === '') payload.notebookLmUrl = null;
    return prisma.skill.update({
      where: { id },
      data: payload,
      select: { ...SKILL_SELECT, industry: { select: { name: true, slug: true, icon: true } } },
    });
  }

  async delete(id: string) {
    return prisma.skill.delete({ where: { id }, select: { id: true, name: true } });
  }
}
