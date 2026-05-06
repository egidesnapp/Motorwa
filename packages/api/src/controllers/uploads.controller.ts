import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { processImage } from '../services/image.service';

export const uploadListingPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const existingPhotos = await prisma.listingPhoto.count({ where: { listingId: listing.id } });

    if (existingPhotos + files.length > 30) {
      return res.status(400).json({ success: false, error: 'Maximum 30 photos per listing' });
    }

    const results = await Promise.all(
      files.map(async (file, index) => {
        const processed = await processImage(file.buffer, listing.id);

        return prisma.listingPhoto.create({
          data: {
            listingId: listing.id,
            photoUrl: processed.originalUrl,
            thumbnailUrl: processed.thumbnailUrl,
            isPrimary: existingPhotos === 0 && index === 0,
            displayOrder: existingPhotos + index,
          },
        });
      })
    );

    res.status(201).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload photos' });
  }
};

export const deleteListingPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const photo = await prisma.listingPhoto.findFirst({
      where: {
        id: req.params.photoId,
        listing: { id: req.params.id, userId: req.user!.id },
      },
    });

    if (!photo) {
      return res.status(404).json({ success: false, error: 'Photo not found' });
    }

    await prisma.listingPhoto.delete({ where: { id: photo.id } });

    if (photo.isPrimary) {
      const nextPhoto = await prisma.listingPhoto.findFirst({
        where: { listingId: photo.listingId },
        orderBy: { displayOrder: 'asc' },
      });

      if (nextPhoto) {
        await prisma.listingPhoto.update({
          where: { id: nextPhoto.id },
          data: { isPrimary: true },
        });
      }
    }

    res.json({ success: true, data: { message: 'Photo deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete photo' });
  }
};

export const reorderListingPhotos = async (req: AuthRequest, res: Response) => {
  try {
    const { order } = req.body as { order: { id: string; displayOrder: number }[] };

    await Promise.all(
      order.map(async (item) =>
        prisma.listingPhoto.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    );

    res.json({ success: true, data: { message: 'Photos reordered' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reorder photos' });
  }
};
