import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  res.json({ success: true, data: [] });
});

router.post('/', requireAuth, async (req, res) => {
  res.json({ success: true, data: { message: 'Inspection booked (stub)' } });
});

router.get('/:id', requireAuth, async (req, res) => {
  res.json({ success: true, data: { message: 'Inspection detail (stub)' } });
});

export default router;
