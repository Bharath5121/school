import { Router } from 'express';
import { CareersController } from '../controllers/careers.controller';
import { validate } from '../../../../shared/utils/validate';
import { industrySlugParamSchema, jobIdParamSchema } from '../validators/careers.validator';

const router = Router();

router.get('/careers/:industrySlug', validate(industrySlugParamSchema), CareersController.getCareerPaths);
router.get('/careers/:industrySlug/jobs', validate(industrySlugParamSchema), CareersController.getJobs);
router.get('/careers/jobs/:id', validate(jobIdParamSchema), CareersController.getJobById);
router.get('/skills/:industrySlug', validate(industrySlugParamSchema), CareersController.getSkills);

export default router;
