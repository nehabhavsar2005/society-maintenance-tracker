import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { notificationController } from './notification.controller';

const router = Router();

router.use(authenticate);
router.get('/', notificationController.list);
router.get('/unread-count', notificationController.unreadCount);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

export default router;
