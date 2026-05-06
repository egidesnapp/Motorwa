import { Router } from 'express';
import { getNotifications, getUnreadCount, markRead, markAllRead, deleteNotification } from '../controllers/notifications.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getNotifications);
router.get('/unread-count', requireAuth, getUnreadCount);
router.put('/:id/read', requireAuth, markRead);
router.put('/read-all', requireAuth, markAllRead);
router.delete('/:id', requireAuth, deleteNotification);

export default router;
