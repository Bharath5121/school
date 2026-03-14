import { Router } from 'express';
import { authenticate } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { ContentBookmarkController } from '../controllers/content-bookmark.controller';
import { addContentBookmarkSchema, removeContentBookmarkSchema } from '../validators/content-bookmark.validator';

const router = Router();

router.use(authenticate);

router.get('/', ContentBookmarkController.list);
router.get('/check', ContentBookmarkController.check);
router.post('/', validate(addContentBookmarkSchema), ContentBookmarkController.add);
router.delete('/:contentType/:contentId', validate(removeContentBookmarkSchema), ContentBookmarkController.remove);

export default router;
