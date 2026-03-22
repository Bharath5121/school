import { Router } from 'express';
import { MyStuffController } from '../controllers/my-stuff.controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();
const ctrl = new MyStuffController();

router.use(authenticate);

// Saved items
router.get('/saved', ctrl.getSavedItems);
router.post('/saved', ctrl.saveItem);
router.get('/saved/check/:contentType/:contentId', ctrl.checkSaved);
router.delete('/saved/:contentType/:contentId', ctrl.unsaveItem);

// Reading history
router.get('/history', ctrl.getHistory);
router.post('/history', ctrl.trackView);
router.delete('/history', ctrl.clearHistory);

// Counts
router.get('/counts', ctrl.getCounts);

export default router;
