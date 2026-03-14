import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';
import { validate } from '../../../shared/utils/validate';
import { createFeedSchema, updateFeedSchema, queryFeedSchema, idParamSchema } from '../validators/feed.validator';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';

const router = Router();
const controller = new FeedController();

router.get('/fields', controller.getFields);
router.get('/trending', controller.getTrending);
router.get('/', validate(queryFeedSchema), controller.getFeed);
router.get('/:id', validate(idParamSchema), controller.getOne);

// Admin routes
router.post('/admin/create', authenticate, requireAdmin, validate(createFeedSchema), controller.create);
router.patch('/admin/:id', authenticate, requireAdmin, validate(updateFeedSchema), controller.update);
router.delete('/admin/:id', authenticate, requireAdmin, validate(idParamSchema), controller.delete);

export default router;
