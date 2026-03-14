import { Router } from 'express';
import { BasicsController } from '../controllers/basics.controller';
import { validate } from '../../../../shared/utils/validate';
import { topicSlugSchema } from '../validators/basics.validator';

const router = Router();
const controller = new BasicsController();

router.get('/topics', controller.getTopics);
router.get('/topics/:slug', validate(topicSlugSchema), controller.getTopicDetail);

export default router;
