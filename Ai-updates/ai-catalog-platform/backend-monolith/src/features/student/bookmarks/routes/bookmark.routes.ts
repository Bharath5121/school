import { Router } from 'express';
import { authenticate } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { BookmarkController } from '../controllers/bookmark.controller';
import { addBookmarkSchema, listBookmarksSchema, removeBookmarkSchema } from '../validators/bookmark.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(listBookmarksSchema), BookmarkController.list);
router.post('/', validate(addBookmarkSchema), BookmarkController.add);
router.delete('/:itemId', validate(removeBookmarkSchema), BookmarkController.remove);

export default router;
