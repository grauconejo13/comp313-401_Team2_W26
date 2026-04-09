import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as semesterController from '../controllers/semester.controller';

const router = Router();

router.get('/', authenticate, semesterController.getMySemester);
router.post('/set', authenticate, semesterController.setMySemester);

/** Legacy path used by older client builds (id ignored; user comes from JWT) */
router.get('/:legacyUserId', authenticate, semesterController.getMySemester);

export default router;
