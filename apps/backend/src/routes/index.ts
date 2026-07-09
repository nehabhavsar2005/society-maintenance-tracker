import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import complaintRoutes from '../modules/complaints/complaint.routes';
import noticeRoutes from '../modules/notices/notice.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import userRoutes from '../modules/users/user.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import auditRoutes from '../modules/audit/audit.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ success: true, message: 'Society Maintenance Tracker API is healthy' }));

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notices', noticeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);
router.use('/audit-logs', auditRoutes);

export default router;
