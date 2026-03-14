import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/asyncHandler';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../../../../shared/response/ApiResponse';

export class AdminController {
  private service = new AdminService();

  // ─── Stats ──────────────────────────────────────────────
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await this.service.getContentStats();
    res.json(ApiResponse.success(stats));
  });

  // ─── Industries ─────────────────────────────────────────
  getIndustries = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllIndustries();
    res.json(ApiResponse.success(data));
  });

  createIndustry = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createIndustry(req.body);
    res.status(201).json(ApiResponse.success(result, 'Industry created'));
  });

  updateIndustry = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateIndustry(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Industry updated'));
  });

  deleteIndustry = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteIndustry(req.params.id);
    res.json(ApiResponse.success(null, 'Industry deleted'));
  });

  // ─── AI Models ──────────────────────────────────────────
  getModels = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAllModels(req.query.industrySlug as string);
    res.json(ApiResponse.success(data));
  });

  getModel = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getModelById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createModel = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createModel(req.body);
    res.status(201).json(ApiResponse.success(result, 'Model created'));
  });

  updateModel = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateModel(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Model updated'));
  });

  deleteModel = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteModel(req.params.id);
    res.json(ApiResponse.success(null, 'Model deleted'));
  });

  // ─── AI Agents ──────────────────────────────────────────
  getAgents = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAllAgents(req.query.industrySlug as string);
    res.json(ApiResponse.success(data));
  });

  getAgent = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAgentById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createAgent = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createAgent(req.body);
    res.status(201).json(ApiResponse.success(result, 'Agent created'));
  });

  updateAgent = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateAgent(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Agent updated'));
  });

  deleteAgent = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteAgent(req.params.id);
    res.json(ApiResponse.success(null, 'Agent deleted'));
  });

  // ─── Apps ───────────────────────────────────────────────
  getApps = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAllApps(req.query.industrySlug as string);
    res.json(ApiResponse.success(data));
  });

  getApp = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAppById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createApp = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createApp(req.body);
    res.status(201).json(ApiResponse.success(result, 'App created'));
  });

  updateApp = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateApp(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'App updated'));
  });

  deleteApp = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteApp(req.params.id);
    res.json(ApiResponse.success(null, 'App deleted'));
  });

  // ─── Guides ────────────────────────────────────────────
  getGuides = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.getAllGuides(req.query.industrySlug as string)));
  });
  createGuide = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(ApiResponse.success(await this.service.createGuide(req.body), 'Guide created'));
  });
  updateGuide = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.updateGuide(req.params.id, req.body), 'Guide updated'));
  });
  deleteGuide = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteGuide(req.params.id);
    res.json(ApiResponse.success(null, 'Guide deleted'));
  });

  // ─── Prompts ──────────────────────────────────────────
  getPrompts = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.getAllPrompts(req.query.industrySlug as string)));
  });
  createPrompt = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(ApiResponse.success(await this.service.createPrompt(req.body), 'Prompt created'));
  });
  updatePrompt = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.updatePrompt(req.params.id, req.body), 'Prompt updated'));
  });
  deletePrompt = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deletePrompt(req.params.id);
    res.json(ApiResponse.success(null, 'Prompt deleted'));
  });

  // ─── Career Paths ─────────────────────────────────────
  getCareerPaths = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.getAllCareerPaths(req.query.industrySlug as string)));
  });
  createCareerPath = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(ApiResponse.success(await this.service.createCareerPath(req.body), 'Career path created'));
  });
  updateCareerPath = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.updateCareerPath(req.params.id, req.body), 'Career path updated'));
  });
  deleteCareerPath = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteCareerPath(req.params.id);
    res.json(ApiResponse.success(null, 'Career path deleted'));
  });

  // ─── Career Jobs ──────────────────────────────────────
  getCareerJobs = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.getAllCareerJobs(req.query.careerPathId as string)));
  });
  createCareerJob = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(ApiResponse.success(await this.service.createCareerJob(req.body), 'Career job created'));
  });
  updateCareerJob = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.updateCareerJob(req.params.id, req.body), 'Career job updated'));
  });
  deleteCareerJob = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteCareerJob(req.params.id);
    res.json(ApiResponse.success(null, 'Career job deleted'));
  });

  // ─── Skills ───────────────────────────────────────────
  getSkills = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.getAllSkills(req.query.industrySlug as string)));
  });
  createSkill = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(ApiResponse.success(await this.service.createSkill(req.body), 'Skill created'));
  });
  updateSkill = asyncHandler(async (req: Request, res: Response) => {
    res.json(ApiResponse.success(await this.service.updateSkill(req.params.id, req.body), 'Skill updated'));
  });
  deleteSkill = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteSkill(req.params.id);
    res.json(ApiResponse.success(null, 'Skill deleted'));
  });

  // ─── Questions ──────────────────────────────────────────
  getQuestions = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getAllQuestions(req.query.industrySlug as string);
    res.json(ApiResponse.success(data));
  });

  createQuestion = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createQuestion(req.body);
    res.status(201).json(ApiResponse.success(result, 'Question created'));
  });

  updateQuestion = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateQuestion(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Question updated'));
  });

  deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteQuestion(req.params.id);
    res.json(ApiResponse.success(null, 'Question deleted'));
  });

  // ─── Basics Topics ─────────────────────────────────────
  getBasicsTopics = asyncHandler(async (_req: Request, res: Response) => {
    const data = await this.service.getAllBasicsTopics();
    res.json(ApiResponse.success(data));
  });

  getBasicsTopic = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getBasicsTopicById(req.params.id);
    res.json(ApiResponse.success(data));
  });

  createBasicsTopic = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createBasicsTopic(req.body);
    res.status(201).json(ApiResponse.success(result, 'Basics topic created'));
  });

  updateBasicsTopic = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateBasicsTopic(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Basics topic updated'));
  });

  deleteBasicsTopic = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteBasicsTopic(req.params.id);
    res.json(ApiResponse.success(null, 'Basics topic deleted'));
  });

  // ─── Basics Videos ─────────────────────────────────────
  createBasicsVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createBasicsVideo(req.body);
    res.status(201).json(ApiResponse.success(result, 'Video added'));
  });

  updateBasicsVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateBasicsVideo(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Video updated'));
  });

  deleteBasicsVideo = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteBasicsVideo(req.params.id);
    res.json(ApiResponse.success(null, 'Video deleted'));
  });

  // ─── Basics Articles ───────────────────────────────────
  createBasicsArticle = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.createBasicsArticle(req.body);
    res.status(201).json(ApiResponse.success(result, 'Article added'));
  });

  updateBasicsArticle = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.service.updateBasicsArticle(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Article updated'));
  });

  deleteBasicsArticle = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteBasicsArticle(req.params.id);
    res.json(ApiResponse.success(null, 'Article deleted'));
  });
}
