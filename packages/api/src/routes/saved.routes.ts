import { Router } from 'express';
import { getSavedListings, saveListing, unsaveListing, getSavedSearches, saveSearch, deleteSavedSearch, toggleSearchAlert } from '../controllers/saved.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/listings', requireAuth, getSavedListings);
router.post('/listings/:id', requireAuth, saveListing);
router.delete('/listings/:id', requireAuth, unsaveListing);
router.get('/searches', requireAuth, getSavedSearches);
router.post('/searches', requireAuth, saveSearch);
router.delete('/searches/:id', requireAuth, deleteSavedSearch);
router.put('/searches/:id/toggle', requireAuth, toggleSearchAlert);

export default router;
