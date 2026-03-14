import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../shared/utils/validate';
import { getMessagesSchema, sendMessageSchema } from './chat.validator';

const router = Router();
const ctrl = new ChatController();

router.use(authenticate);

router.get('/messages', validate(getMessagesSchema), ctrl.getMessages);
router.post('/messages', validate(sendMessageSchema), ctrl.sendMessage);

export default router;
