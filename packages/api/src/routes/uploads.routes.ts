import { Router } from 'express';
import { uploadListingPhotos, deleteListingPhoto, reorderListingPhotos } from '../controllers/uploads.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/:id/photos', requireAuth, upload.array('photos', 30), uploadListingPhotos);
router.delete('/:id/photos/:photoId', requireAuth, deleteListingPhoto);
router.put('/:id/photos/reorder', requireAuth, reorderListingPhotos);

export default router;
