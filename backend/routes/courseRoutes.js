import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyEnrollments,
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/my/enrollments', protect, getMyEnrollments);
router.post('/enroll', protect, enrollCourse);
router.get('/:id', (req, res, next) => {
  // Optional auth to attach user if token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, getCourseById);

// Instructor-only routes
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

export default router;
