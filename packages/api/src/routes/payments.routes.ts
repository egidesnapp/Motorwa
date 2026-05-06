import { Router } from 'express';
import { initiatePayment, mtnCallback, airtelCallback, getPaymentHistory, getPayment } from '../controllers/payments.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/initiate', requireAuth, initiatePayment);
router.post('/mtn/callback', mtnCallback);
router.post('/airtel/callback', airtelCallback);
router.get('/history', requireAuth, getPaymentHistory);
router.get('/:id', requireAuth, getPayment);

export default router;
