import express from 'express';
import { getStudentAnalytics, getInstructorAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/student', protect, getStudentAnalytics);
router.get('/instructor', protect, authorize('instructor'), getInstructorAnalytics);

export default router;
