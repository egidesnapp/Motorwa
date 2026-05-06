import { Router } from 'express';
import { getConversations, getConversation, startConversation, sendMessage, markRead, archiveConversation } from '../controllers/messages.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getConversations);
router.post('/', requireAuth, startConversation);
router.get('/:id', requireAuth, getConversation);
router.post('/:id/messages', requireAuth, sendMessage);
router.put('/:id/read', requireAuth, markRead);
router.delete('/:id', requireAuth, archiveConversation);

export default router;
