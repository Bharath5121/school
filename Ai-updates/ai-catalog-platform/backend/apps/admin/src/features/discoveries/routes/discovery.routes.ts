import { Router } from 'express';
import { authenticate, requireAdmin } from '../../../middleware/auth.middleware';
import { validate } from '../../../shared/utils/validate';
import { discoveryController } from '../controllers/discovery.controller';
import {
  listQuerySchema,
  idParamSchema,
  createDiscoverySchema,
  updateDiscoverySchema,
  addLinkSchema,
  removeLinkSchema,
} from '../validators/discovery.validator';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/', validate(listQuerySchema), discoveryController.list);
router.get('/:id', validate(idParamSchema), discoveryController.getById);
router.post('/', validate(createDiscoverySchema), discoveryController.create);
router.put('/:id', validate(updateDiscoverySchema), discoveryController.update);
router.delete('/:id', validate(idParamSchema), discoveryController.delete);
router.post('/:id/publish', validate(idParamSchema), discoveryController.togglePublish);
router.post('/:id/links', validate(addLinkSchema), discoveryController.addLink);
router.delete('/:id/links/:linkId', validate(removeLinkSchema), discoveryController.removeLink);

export default router;
