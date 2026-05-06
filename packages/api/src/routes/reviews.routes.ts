import { Router } from 'express';
import { createReview, respondToReview, flagReview, getUserReviews } from '../controllers/reviews.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/user/:userId', getUserReviews);
router.post('/', requireAuth, createReview);
router.put('/:id/response', requireAuth, respondToReview);
router.post('/:id/flag', requireAuth, flagReview);

export default router;
