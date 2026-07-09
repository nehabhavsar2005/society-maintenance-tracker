import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { uploadComplaintImages } from '../../middlewares/upload.middleware';
import { complaintController } from './complaint.controller';
import {
  adminUpdateComplaintSchema,
  bulkActionSchema,
  createComplaintSchema,
  updateComplaintSchema,
} from './complaint.dto';

const router = Router();

router.use(authenticate);

router.get('/', complaintController.list);
router.post('/', uploadComplaintImages, validate(createComplaintSchema), complaintController.create);
router.post('/bulk', requireAdmin, validate(bulkActionSchema), complaintController.bulkAction);
router.get('/:id', complaintController.getById);
router.patch('/:id', uploadComplaintImages, validate(updateComplaintSchema), complaintController.update);
router.patch('/:id/admin', requireAdmin, validate(adminUpdateComplaintSchema), complaintController.adminUpdate);
router.delete('/:id', complaintController.delete);

export default router;
