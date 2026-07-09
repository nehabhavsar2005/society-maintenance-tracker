import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { settingsController } from './settings.controller';
import { updatePrioritySettingsSchema } from './settings.dto';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/priority', settingsController.getPrioritySettings);
router.put('/priority', validate(updatePrioritySettingsSchema), settingsController.updatePrioritySettings);

export default router;
