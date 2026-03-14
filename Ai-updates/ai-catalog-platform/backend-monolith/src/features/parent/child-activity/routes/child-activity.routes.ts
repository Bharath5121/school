import { Router } from 'express';
import { ChildActivityController } from '../controllers/child-activity.controller';
import { authenticate, requireParent, verifyParentChildLink } from '../../../../middleware/auth.middleware';

const router = Router();
const controller = new ChildActivityController();

router.use(authenticate, requireParent);

router.get('/:childId/overview', verifyParentChildLink, controller.getOverview);
router.get('/:childId/notebooks', verifyParentChildLink, controller.getNotebooks);
router.get('/:childId/activity', verifyParentChildLink, controller.getActivity);
router.get('/:childId/skills', verifyParentChildLink, controller.getSkills);
router.get('/:childId/career', verifyParentChildLink, controller.getCareer);
router.get('/:childId/time-spent', verifyParentChildLink, controller.getTimeSpent);
router.get('/:childId/completed', verifyParentChildLink, controller.getCompleted);
router.get('/:childId/student-dashboard', verifyParentChildLink, controller.getStudentDashboard);
router.get('/:childId/interests', verifyParentChildLink, controller.getChildInterests);
router.get('/:childId/skill-progress', verifyParentChildLink, controller.getChildSkillProgress);
router.get('/:childId/career-stats', verifyParentChildLink, controller.getChildCareerStats);

export default router;
