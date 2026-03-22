import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { discoveryController } from '../controllers/discovery.controller';
import { listQuerySchema, slugParamSchema, chatMessageSchema } from '../validators/discovery.validator';

const router = Router();

router.get('/', validate(listQuerySchema), discoveryController.list);
router.get('/:slug', validate(slugParamSchema), discoveryController.getBySlug);
router.get('/:slug/chat', authenticate, validate(slugParamSchema), discoveryController.getChatMessages);
router.post('/:slug/chat', authenticate, validate(chatMessageSchema), discoveryController.postChatMessage);

export default router;
