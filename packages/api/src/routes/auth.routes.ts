import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, logoutHandler, logoutAllHandler } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', authLimiter, loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);
router.post('/logout-all', requireAuth, logoutAllHandler);

export default router;
