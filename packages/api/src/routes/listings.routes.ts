import { Router } from 'express';
import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getFeaturedListings,
  revealPhone,
  boostListing,
  featureListing,
  getListingStats,
  getSimilarListings,
  getPriceHistory,
  updateListingStatus,
} from '../controllers/listings.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getListings);
router.get('/featured', getFeaturedListings);
router.get('/:id', getListing);
router.post('/', requireAuth, createListing);
router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);
router.put('/:id/status', requireAuth, updateListingStatus);
router.post('/:id/boost', requireAuth, boostListing);
router.post('/:id/feature', requireAuth, featureListing);
router.post('/:id/reveal-phone', requireAuth, revealPhone);
router.get('/:id/similar', getSimilarListings);
router.get('/:id/price-history', getPriceHistory);
router.get('/:id/stats', requireAuth, getListingStats);

export default router;
