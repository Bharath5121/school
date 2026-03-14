import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate, requireParent } from '../../../../middleware/auth.middleware';

const router = Router();
const controller = new NotificationController();

router.use(authenticate, requireParent);

router.get('/', controller.list);
router.get('/unread-count', controller.unreadCount);
router.patch('/:noteId/read', controller.markRead);

export default router;
