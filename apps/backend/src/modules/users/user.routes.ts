import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { userController } from './user.controller';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', userController.listAll);
router.get('/residents', userController.listResidents);
router.get('/admins', userController.listAdmins);
router.patch('/:id/toggle-active', userController.toggleActive);

export default router;
