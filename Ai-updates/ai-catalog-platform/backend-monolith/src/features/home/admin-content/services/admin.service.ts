import { AdminRepository } from '../repositories/admin.repository';
import { BasicsRepository } from '../../basics/repositories/basics.repository';
import { AppError } from '../../../../shared/errors/AppError';

export class AdminService {
  private repo = new AdminRepository();
  private basicsRepo = new BasicsRepository();

  // ─── Stats ──────────────────────────────────────────────
  async getContentStats() {
    return this.repo.getContentStats();
  }

  // ─── Industries ─────────────────────────────────────────
  async getAllIndustries() {
    return this.repo.getAllIndustries();
  }

  async createIndustry(data: any) {
    return this.repo.createIndustry(data);
  }

  async updateIndustry(id: string, data: any) {
    return this.repo.updateIndustry(id, data);
  }

  async deleteIndustry(id: string) {
    return this.repo.deleteIndustry(id);
  }

  // ─── AI Models ──────────────────────────────────────────
  async getAllModels(industrySlug?: string) {
    return this.repo.getAllModels(industrySlug);
  }

  async getModelById(id: string) {
    const model = await this.repo.getModelById(id);
    if (!model) throw new AppError('Model not found', 404);
    return model;
  }

  async createModel(data: any) {
    return this.repo.createModel(data);
  }

  async updateModel(id: string, data: any) {
    await this.getModelById(id);
    return this.repo.updateModel(id, data);
  }

  async deleteModel(id: string) {
    await this.getModelById(id);
    return this.repo.deleteModel(id);
  }

  // ─── AI Agents ──────────────────────────────────────────
  async getAllAgents(industrySlug?: string) {
    return this.repo.getAllAgents(industrySlug);
  }

  async getAgentById(id: string) {
    const agent = await this.repo.getAgentById(id);
    if (!agent) throw new AppError('Agent not found', 404);
    return agent;
  }

  async createAgent(data: any) {
    return this.repo.createAgent(data);
  }

  async updateAgent(id: string, data: any) {
    await this.getAgentById(id);
    return this.repo.updateAgent(id, data);
  }

  async deleteAgent(id: string) {
    await this.getAgentById(id);
    return this.repo.deleteAgent(id);
  }

  // ─── AI Apps ────────────────────────────────────────────
  async getAllApps(industrySlug?: string) {
    return this.repo.getAllApps(industrySlug);
  }

  async getAppById(id: string) {
    const app = await this.repo.getAppById(id);
    if (!app) throw new AppError('App not found', 404);
    return app;
  }

  async createApp(data: any) {
    return this.repo.createApp(data);
  }

  async updateApp(id: string, data: any) {
    await this.getAppById(id);
    return this.repo.updateApp(id, data);
  }

  async deleteApp(id: string) {
    await this.getAppById(id);
    return this.repo.deleteApp(id);
  }

  // ─── Guides ────────────────────────────────────────────
  async getAllGuides(s?: string) { return this.repo.getAllGuides(s); }
  async createGuide(d: any) { return this.repo.createGuide(d); }
  async updateGuide(id: string, d: any) { return this.repo.updateGuide(id, d); }
  async deleteGuide(id: string) { return this.repo.deleteGuide(id); }

  // ─── Prompts ──────────────────────────────────────────
  async getAllPrompts(s?: string) { return this.repo.getAllPrompts(s); }
  async createPrompt(d: any) { return this.repo.createPrompt(d); }
  async updatePrompt(id: string, d: any) { return this.repo.updatePrompt(id, d); }
  async deletePrompt(id: string) { return this.repo.deletePrompt(id); }

  // ─── Career Paths ─────────────────────────────────────
  async getAllCareerPaths(s?: string) { return this.repo.getAllCareerPaths(s); }
  async createCareerPath(d: any) { return this.repo.createCareerPath(d); }
  async updateCareerPath(id: string, d: any) { return this.repo.updateCareerPath(id, d); }
  async deleteCareerPath(id: string) { return this.repo.deleteCareerPath(id); }

  // ─── Career Jobs ──────────────────────────────────────
  async getAllCareerJobs(s?: string) { return this.repo.getAllCareerJobs(s); }
  async createCareerJob(d: any) { return this.repo.createCareerJob(d); }
  async updateCareerJob(id: string, d: any) { return this.repo.updateCareerJob(id, d); }
  async deleteCareerJob(id: string) { return this.repo.deleteCareerJob(id); }

  // ─── Skills ───────────────────────────────────────────
  async getAllSkills(s?: string) { return this.repo.getAllSkills(s); }
  async createSkill(d: any) { return this.repo.createSkill(d); }
  async updateSkill(id: string, d: any) { return this.repo.updateSkill(id, d); }
  async deleteSkill(id: string) { return this.repo.deleteSkill(id); }

  // ─── Predefined Questions ──────────────────────────────
  async getAllQuestions(industrySlug?: string) {
    return this.repo.getAllQuestions(industrySlug);
  }

  async getQuestionById(id: string) {
    const q = await this.repo.getQuestionById(id);
    if (!q) throw new AppError('Question not found', 404);
    return q;
  }

  async createQuestion(data: any) {
    return this.repo.createQuestion(data);
  }

  async updateQuestion(id: string, data: any) {
    await this.getQuestionById(id);
    return this.repo.updateQuestion(id, data);
  }

  async deleteQuestion(id: string) {
    await this.getQuestionById(id);
    return this.repo.deleteQuestion(id);
  }

  // ─── Basics ─────────────────────────────────────────────
  async getAllBasicsTopics() {
    return this.basicsRepo.getAllTopics();
  }

  async getBasicsTopicById(id: string) {
    const topic = await this.basicsRepo.getTopicById(id);
    if (!topic) throw new AppError('Basics topic not found', 404);
    return topic;
  }

  async createBasicsTopic(data: any) {
    return this.basicsRepo.createTopic(data);
  }

  async updateBasicsTopic(id: string, data: any) {
    await this.getBasicsTopicById(id);
    return this.basicsRepo.updateTopic(id, data);
  }

  async deleteBasicsTopic(id: string) {
    await this.getBasicsTopicById(id);
    return this.basicsRepo.deleteTopic(id);
  }

  async createBasicsVideo(data: any) {
    return this.basicsRepo.createVideo(data);
  }

  async updateBasicsVideo(id: string, data: any) {
    return this.basicsRepo.updateVideo(id, data);
  }

  async deleteBasicsVideo(id: string) {
    return this.basicsRepo.deleteVideo(id);
  }

  async createBasicsArticle(data: any) {
    return this.basicsRepo.createArticle(data);
  }

  async updateBasicsArticle(id: string, data: any) {
    return this.basicsRepo.updateArticle(id, data);
  }

  async deleteBasicsArticle(id: string) {
    return this.basicsRepo.deleteArticle(id);
  }
}
