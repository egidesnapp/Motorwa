import { Router } from 'express';
import { sendOtpHandler, verifyOtpHandler, refreshHandler, logoutHandler, logoutAllHandler } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { otpLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/send-otp', otpLimiter, sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);
router.post('/logout-all', requireAuth, logoutAllHandler);

export default router;
