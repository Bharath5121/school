import { Router } from 'express';
import { LabController } from '../controllers/lab.controller';
import { authenticate } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { slugParamSchema, chatMessageSchema } from '../validators/lab.validator';

const router = Router();
const ctrl = new LabController();

router.get('/categories', ctrl.getCategories);
router.get('/categories/:slug', validate(slugParamSchema), ctrl.getCategoryBySlug);
router.get('/items/:slug', validate(slugParamSchema), ctrl.getItemBySlug);
router.get('/items/:slug/chat', authenticate, validate(slugParamSchema), ctrl.getChatMessages);
router.post('/items/:slug/chat', authenticate, validate(chatMessageSchema), ctrl.sendChatMessage);

export default router;
