import { Router } from 'express';
import { BasicsController } from '../controllers/basics.controller';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import {
  idParamSchema,
  listBasicsQuerySchema,
  createChapterSchema,
  updateChapterSchema,
  createBasicsTopicSchema,
  updateBasicsTopicSchema,
  createBasicsVideoSchema,
  updateBasicsVideoSchema,
  createBasicsArticleSchema,
  updateBasicsArticleSchema,
  createTopicLinkSchema,
  updateTopicLinkSchema,
} from '../validators/basics.validator';

const router = Router();
const ctrl = new BasicsController();

router.use(authenticate, requireAdmin);

// Chapters
router.get('/chapters', ctrl.getChapters);
router.get('/chapters/:id', validate(idParamSchema), ctrl.getChapter);
router.post('/chapters', validate(createChapterSchema), ctrl.createChapter);
router.put('/chapters/:id', validate(updateChapterSchema), ctrl.updateChapter);
router.delete('/chapters/:id', validate(idParamSchema), ctrl.deleteChapter);

// Topics
router.get('/topics', validate(listBasicsQuerySchema), ctrl.getTopics);
router.get('/topics/:id', validate(idParamSchema), ctrl.getTopic);
router.post('/topics', validate(createBasicsTopicSchema), ctrl.createTopic);
router.put('/topics/:id', validate(updateBasicsTopicSchema), ctrl.updateTopic);
router.delete('/topics/:id', validate(idParamSchema), ctrl.deleteTopic);

// Topic Links
router.post('/links', validate(createTopicLinkSchema), ctrl.createTopicLink);
router.put('/links/:id', validate(updateTopicLinkSchema), ctrl.updateTopicLink);
router.delete('/links/:id', validate(idParamSchema), ctrl.deleteTopicLink);

// Videos
router.post('/videos', validate(createBasicsVideoSchema), ctrl.createVideo);
router.put('/videos/:id', validate(updateBasicsVideoSchema), ctrl.updateVideo);
router.delete('/videos/:id', validate(idParamSchema), ctrl.deleteVideo);

// Articles
router.post('/articles', validate(createBasicsArticleSchema), ctrl.createArticle);
router.put('/articles/:id', validate(updateBasicsArticleSchema), ctrl.updateArticle);
router.delete('/articles/:id', validate(idParamSchema), ctrl.deleteArticle);

export default router;
