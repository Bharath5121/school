import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import {
  idParamSchema,
  industrySlugQuerySchema,
  createIndustrySchema,
  updateIndustrySchema,
  createModelSchema,
  createAgentSchema,
  createAppSchema,
  createGuideSchema,
  createPromptSchema,
  createCareerPathSchema,
  createCareerJobSchema,
  createSkillSchema,
  createQuestionSchema,
  createBasicsTopicSchema,
  createBasicsVideoSchema,
  createBasicsArticleSchema,
} from '../validators/admin.validator';

const router = Router();
const ctrl = new AdminController();

router.use(authenticate, requireAdmin);

router.get('/stats', ctrl.getStats);

router.get('/industries', ctrl.getIndustries);
router.post('/industries', validate(createIndustrySchema), ctrl.createIndustry);
router.put('/industries/:id', validate(updateIndustrySchema), ctrl.updateIndustry);
router.delete('/industries/:id', validate(idParamSchema), ctrl.deleteIndustry);

router.get('/models', validate(industrySlugQuerySchema), ctrl.getModels);
router.get('/models/:id', validate(idParamSchema), ctrl.getModel);
router.post('/models', validate(createModelSchema), ctrl.createModel);
router.put('/models/:id', validate(idParamSchema), ctrl.updateModel);
router.delete('/models/:id', validate(idParamSchema), ctrl.deleteModel);

router.get('/agents', validate(industrySlugQuerySchema), ctrl.getAgents);
router.get('/agents/:id', validate(idParamSchema), ctrl.getAgent);
router.post('/agents', validate(createAgentSchema), ctrl.createAgent);
router.put('/agents/:id', validate(idParamSchema), ctrl.updateAgent);
router.delete('/agents/:id', validate(idParamSchema), ctrl.deleteAgent);

router.get('/apps', validate(industrySlugQuerySchema), ctrl.getApps);
router.get('/apps/:id', validate(idParamSchema), ctrl.getApp);
router.post('/apps', validate(createAppSchema), ctrl.createApp);
router.put('/apps/:id', validate(idParamSchema), ctrl.updateApp);
router.delete('/apps/:id', validate(idParamSchema), ctrl.deleteApp);

router.get('/guides', validate(industrySlugQuerySchema), ctrl.getGuides);
router.post('/guides', validate(createGuideSchema), ctrl.createGuide);
router.put('/guides/:id', validate(idParamSchema), ctrl.updateGuide);
router.delete('/guides/:id', validate(idParamSchema), ctrl.deleteGuide);

router.get('/prompts', validate(industrySlugQuerySchema), ctrl.getPrompts);
router.post('/prompts', validate(createPromptSchema), ctrl.createPrompt);
router.put('/prompts/:id', validate(idParamSchema), ctrl.updatePrompt);
router.delete('/prompts/:id', validate(idParamSchema), ctrl.deletePrompt);

router.get('/career-paths', validate(industrySlugQuerySchema), ctrl.getCareerPaths);
router.post('/career-paths', validate(createCareerPathSchema), ctrl.createCareerPath);
router.put('/career-paths/:id', validate(idParamSchema), ctrl.updateCareerPath);
router.delete('/career-paths/:id', validate(idParamSchema), ctrl.deleteCareerPath);

router.get('/career-jobs', ctrl.getCareerJobs);
router.post('/career-jobs', validate(createCareerJobSchema), ctrl.createCareerJob);
router.put('/career-jobs/:id', validate(idParamSchema), ctrl.updateCareerJob);
router.delete('/career-jobs/:id', validate(idParamSchema), ctrl.deleteCareerJob);

router.get('/skills', validate(industrySlugQuerySchema), ctrl.getSkills);
router.post('/skills', validate(createSkillSchema), ctrl.createSkill);
router.put('/skills/:id', validate(idParamSchema), ctrl.updateSkill);
router.delete('/skills/:id', validate(idParamSchema), ctrl.deleteSkill);

router.get('/questions', validate(industrySlugQuerySchema), ctrl.getQuestions);
router.post('/questions', validate(createQuestionSchema), ctrl.createQuestion);
router.put('/questions/:id', validate(idParamSchema), ctrl.updateQuestion);
router.delete('/questions/:id', validate(idParamSchema), ctrl.deleteQuestion);

router.get('/basics/topics', ctrl.getBasicsTopics);
router.get('/basics/topics/:id', validate(idParamSchema), ctrl.getBasicsTopic);
router.post('/basics/topics', validate(createBasicsTopicSchema), ctrl.createBasicsTopic);
router.put('/basics/topics/:id', validate(idParamSchema), ctrl.updateBasicsTopic);
router.delete('/basics/topics/:id', validate(idParamSchema), ctrl.deleteBasicsTopic);

router.post('/basics/videos', validate(createBasicsVideoSchema), ctrl.createBasicsVideo);
router.put('/basics/videos/:id', validate(idParamSchema), ctrl.updateBasicsVideo);
router.delete('/basics/videos/:id', validate(idParamSchema), ctrl.deleteBasicsVideo);

router.post('/basics/articles', validate(createBasicsArticleSchema), ctrl.createBasicsArticle);
router.put('/basics/articles/:id', validate(idParamSchema), ctrl.updateBasicsArticle);
router.delete('/basics/articles/:id', validate(idParamSchema), ctrl.deleteBasicsArticle);

export default router;
