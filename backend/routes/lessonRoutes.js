import express from 'express';
import {
  getLessonsByCourse,
  getLessonById,
  markLessonCompleted,
  createLesson,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);
router.post('/:id/complete', protect, markLessonCompleted);

// Instructor-only
router.post('/', protect, authorize('instructor'), createLesson);

export default router;
