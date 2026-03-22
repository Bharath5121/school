import { Router } from 'express';
import { BuddyController } from '../controllers/buddy.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new BuddyController();

router.use(authenticate);

router.get('/conversations', ctrl.getConversations);
router.post('/conversations', ctrl.createConversation);
router.get('/conversations/:id', ctrl.getConversation);
router.get('/conversations/:id/messages', ctrl.getMessages);
router.post('/conversations/:id/messages', ctrl.sendMessage);
router.patch('/conversations/:id/title', ctrl.updateTitle);
router.delete('/conversations/:id', ctrl.deleteConversation);

export default router;
