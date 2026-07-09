import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { noticeController } from './notice.controller';
import { createNoticeSchema, updateNoticeSchema } from './notice.dto';

const router = Router();

router.use(authenticate);

router.get('/', noticeController.list);
router.post('/', requireAdmin, validate(createNoticeSchema), noticeController.create);
router.get('/:id', noticeController.getById);
router.patch('/:id', requireAdmin, validate(updateNoticeSchema), noticeController.update);
router.patch('/:id/pin', requireAdmin, noticeController.togglePin);
router.delete('/:id', requireAdmin, noticeController.delete);

export default router;
