import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getRecommendations);

export default router;
