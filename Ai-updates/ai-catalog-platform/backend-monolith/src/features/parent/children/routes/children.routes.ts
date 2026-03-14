import { Router } from 'express';
import { ChildrenController } from '../controllers/children.controller';
import { authenticate, requireParent } from '../../../../middleware/auth.middleware';
import { validate } from '../../../../shared/utils/validate';
import { linkChildSchema } from '../validators/children.validator';

const router = Router();
const controller = new ChildrenController();

router.use(authenticate, requireParent);

router.get('/', controller.list);
router.post('/link', validate(linkChildSchema), controller.link);
router.delete('/:childId', controller.unlink);

export default router;
