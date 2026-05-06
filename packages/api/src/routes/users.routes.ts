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
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.delete('/me', requireAuth, deleteMe);
router.get('/me/stats', requireAuth, getMeStats);
router.get('/:id', getPublicProfile);
router.get('/:id/reviews', getUserReviews);
router.get('/:id/listings', getUserListings);

export default router;
