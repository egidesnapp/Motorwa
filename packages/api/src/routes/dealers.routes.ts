import { Router } from 'express';
import { getDealers, getDealer, applyForDealer, updateDealer, getDealerAnalytics } from '../controllers/dealers.controller';
import { requireAuth, requireDealer, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getDealers);
router.get('/:id', getDealer);
router.post('/apply', requireAuth, applyForDealer);
router.get('/me/analytics', requireAuth, getDealerAnalytics);
router.put('/me', requireDealer, updateDealer);

export default router;
