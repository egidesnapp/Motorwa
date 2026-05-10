import { Router } from 'express';
import {
  getMe,
  updateMe,
  deleteMe,
  getMeStats,
  getPublicProfile,
  getUserReviews,
  getUserListings,
} from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);
router.get('/me/stats', authMiddleware, getMeStats);
router.get('/:id', getPublicProfile);
router.get('/:id/reviews', getUserReviews);
router.get('/:id/listings', getUserListings);

export default router;
