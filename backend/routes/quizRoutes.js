import express from 'express';
import {
  getQuizById,
  submitQuiz,
  getStudentAttempts,
  createQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/my/attempts', protect, getStudentAttempts);
router.get('/:id', getQuizById);
router.post('/:id/submit', protect, submitQuiz);

// Instructor-only
router.post('/', protect, authorize('instructor'), createQuiz);

export default router;
