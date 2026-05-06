import { Router } from 'express';
import { getDashboard, getListings, approveListing, rejectListing, getUsers, banUser, unbanUser, verifyUserId, approveDealer, getReports, resolveReport, getLogs } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', requireAdmin, getDashboard);
router.get('/listings', requireAdmin, getListings);
router.put('/listings/:id/approve', requireAdmin, approveListing);
router.put('/listings/:id/reject', requireAdmin, rejectListing);
router.get('/users', requireAdmin, getUsers);
router.put('/users/:id/ban', requireAdmin, banUser);
router.put('/users/:id/unban', requireAdmin, unbanUser);
router.put('/users/:id/verify-id', requireAdmin, verifyUserId);
router.post('/dealers/:id/approve', requireAdmin, approveDealer);
router.get('/reports', requireAdmin, getReports);
router.put('/reports/:id/resolve', requireAdmin, resolveReport);
router.get('/logs', requireAdmin, getLogs);

export default router;
