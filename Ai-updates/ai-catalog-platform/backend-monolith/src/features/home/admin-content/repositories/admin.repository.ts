import { prisma } from '../../../../config/database';

export class AdminRepository {
  // ─── Stats ──────────────────────────────────────────────
  async getContentStats() {
    const [industries, models, agents, apps, questions, basicsTopics, basicsVideos, basicsArticles] = await Promise.all([
      prisma.industry.count(),
      prisma.aIModel.count(),
      prisma.aIAgent.count(),
      prisma.aIApp.count(),
      prisma.predefinedQuestion.count(),
      prisma.basicsTopic.count(),
      prisma.basicsVideo.count(),
      prisma.basicsArticle.count(),
    ]);
    return { industries, models, agents, apps, questions, basicsTopics, basicsVideos, basicsArticles };
  }

  // ─── Industries ─────────────────────────────────────────
  async getAllIndustries() {
    return prisma.industry.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { models: true, agents: true, apps: true, questions: true } } },
    });
  }

  async createIndustry(data: any) {
    return prisma.industry.create({ data });
  }

  async updateIndustry(id: string, data: any) {
    return prisma.industry.update({ where: { id }, data });
  }

  async deleteIndustry(id: string) {
    return prisma.industry.delete({ where: { id } });
  }

  // ─── AI Models ──────────────────────────────────────────
  async getAllModels(industrySlug?: string) {
    return prisma.aIModel.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { industry: { select: { name: true, slug: true } } },
    });
  }

  async getModelById(id: string) {
    return prisma.aIModel.findUnique({ where: { id }, include: { industry: { select: { name: true, slug: true } } } });
  }

  async createModel(data: any) {
    return prisma.aIModel.create({ data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async updateModel(id: string, data: any) {
    return prisma.aIModel.update({ where: { id }, data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async deleteModel(id: string) {
    return prisma.aIModel.delete({ where: { id } });
  }

  // ─── AI Agents ──────────────────────────────────────────
  async getAllAgents(industrySlug?: string) {
    return prisma.aIAgent.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { industry: { select: { name: true, slug: true } } },
    });
  }

  async getAgentById(id: string) {
    return prisma.aIAgent.findUnique({ where: { id }, include: { industry: { select: { name: true, slug: true } } } });
  }

  async createAgent(data: any) {
    return prisma.aIAgent.create({ data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async updateAgent(id: string, data: any) {
    return prisma.aIAgent.update({ where: { id }, data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async deleteAgent(id: string) {
    return prisma.aIAgent.delete({ where: { id } });
  }

  // ─── AI Apps ────────────────────────────────────────────
  async getAllApps(industrySlug?: string) {
    return prisma.aIApp.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { industry: { select: { name: true, slug: true } } },
    });
  }

  async getAppById(id: string) {
    return prisma.aIApp.findUnique({ where: { id }, include: { industry: { select: { name: true, slug: true } } } });
  }

  async createApp(data: any) {
    return prisma.aIApp.create({ data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async updateApp(id: string, data: any) {
    return prisma.aIApp.update({ where: { id }, data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async deleteApp(id: string) {
    return prisma.aIApp.delete({ where: { id } });
  }

  // ─── Guides ────────────────────────────────────────────
  async getAllGuides(industrySlug?: string) {
    return prisma.guide.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { industry: { select: { name: true, slug: true } } },
    });
  }
  async createGuide(data: any) { return prisma.guide.create({ data }); }
  async updateGuide(id: string, data: any) { return prisma.guide.update({ where: { id }, data }); }
  async deleteGuide(id: string) { return prisma.guide.delete({ where: { id } }); }

  // ─── Prompt Templates ─────────────────────────────────
  async getAllPrompts(industrySlug?: string) {
    return prisma.promptTemplate.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: { industry: { select: { name: true, slug: true } } },
    });
  }
  async createPrompt(data: any) { return prisma.promptTemplate.create({ data }); }
  async updatePrompt(id: string, data: any) { return prisma.promptTemplate.update({ where: { id }, data }); }
  async deletePrompt(id: string) { return prisma.promptTemplate.delete({ where: { id } }); }

  // ─── Career Paths ─────────────────────────────────────
  async getAllCareerPaths(industrySlug?: string) {
    return prisma.careerPath.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: { industry: { select: { name: true, slug: true } }, _count: { select: { jobs: true } } },
    });
  }
  async createCareerPath(data: any) { return prisma.careerPath.create({ data }); }
  async updateCareerPath(id: string, data: any) { return prisma.careerPath.update({ where: { id }, data }); }
  async deleteCareerPath(id: string) { return prisma.careerPath.delete({ where: { id } }); }

  // ─── Career Jobs ──────────────────────────────────────
  async getAllCareerJobs(careerPathId?: string) {
    return prisma.careerJob.findMany({
      where: careerPathId ? { careerPathId } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: { careerPath: { select: { title: true, industrySlug: true } } },
    });
  }
  async createCareerJob(data: any) { return prisma.careerJob.create({ data }); }
  async updateCareerJob(id: string, data: any) { return prisma.careerJob.update({ where: { id }, data }); }
  async deleteCareerJob(id: string) { return prisma.careerJob.delete({ where: { id } }); }

  // ─── Skills ───────────────────────────────────────────
  async getAllSkills(industrySlug?: string) {
    return prisma.skill.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      include: { industry: { select: { name: true, slug: true } } },
    });
  }
  async createSkill(data: any) { return prisma.skill.create({ data }); }
  async updateSkill(id: string, data: any) { return prisma.skill.update({ where: { id }, data }); }
  async deleteSkill(id: string) { return prisma.skill.delete({ where: { id } }); }

  // ─── Predefined Questions ──────────────────────────────
  async getAllQuestions(industrySlug?: string) {
    return prisma.predefinedQuestion.findMany({
      where: industrySlug ? { industrySlug } : undefined,
      orderBy: { sortOrder: 'asc' },
      include: { industry: { select: { name: true, slug: true } } },
    });
  }

  async getQuestionById(id: string) {
    return prisma.predefinedQuestion.findUnique({ where: { id }, include: { industry: { select: { name: true, slug: true } } } });
  }

  async createQuestion(data: any) {
    return prisma.predefinedQuestion.create({ data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async updateQuestion(id: string, data: any) {
    return prisma.predefinedQuestion.update({ where: { id }, data, include: { industry: { select: { name: true, slug: true } } } });
  }

  async deleteQuestion(id: string) {
    return prisma.predefinedQuestion.delete({ where: { id } });
  }
}
