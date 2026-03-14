import { Router } from 'express';
import { DetailController } from '../controllers/detail.controller';
import { validate } from '../../../../shared/utils/validate';
import { slugParamSchema } from '../validators/detail.validator';

const router = Router();
const controller = new DetailController();

router.get('/:slug/all', validate(slugParamSchema), controller.getAllContent);
router.get('/:slug/models', validate(slugParamSchema), controller.getModels);
router.get('/:slug/agents', validate(slugParamSchema), controller.getAgents);
router.get('/:slug/apps', validate(slugParamSchema), controller.getApps);

export default router;
