import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getSavedListings = async (req: AuthRequest, res: Response) => {
  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: req.user!.id },
      include: {
        listing: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
            user: { select: { id: true, fullName: true, isIdVerified: true } },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    res.json({ success: true, data: saved.map((s) => s.listing) });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch saved listings' });
  }
};

export const saveListing = async (req: AuthRequest, res: Response) => {
  try {
    const saved = await prisma.savedListing.create({
      data: {
        userId: req.user!.id,
        listingId: req.params.id,
      },
    });

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { savesCount: { increment: 1 } },
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, error: 'Already saved' });
    }
    res.status(500).json({ success: false, error: 'Failed to save listing' });
  }
};

export const unsaveListing = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.savedListing.deleteMany({
      where: { userId: req.user!.id, listingId: req.params.id },
    });

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { savesCount: { decrement: 1 } },
    });

    res.json({ success: true, data: { message: 'Listing unsaved' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unsave listing' });
  }
};

export const getSavedSearches = async (req: AuthRequest, res: Response) => {
  try {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: searches });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch saved searches' });
  }
};

export const saveSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { name, searchParams, alertEnabled = true } = req.body;

    const saved = await prisma.savedSearch.create({
      data: {
        userId: req.user!.id,
        name,
        searchParams,
        alertEnabled,
      },
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save search' });
  }
};

export const deleteSavedSearch = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.savedSearch.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });

    res.json({ success: true, data: { message: 'Saved search deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete saved search' });
  }
};

export const toggleSearchAlert = async (req: AuthRequest, res: Response) => {
  try {
    const search = await prisma.savedSearch.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!search) {
      return res.status(404).json({ success: false, error: 'Saved search not found' });
    }

    await prisma.savedSearch.update({
      where: { id: search.id },
      data: { alertEnabled: !search.alertEnabled },
    });

    res.json({ success: true, data: { message: 'Alert toggled' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to toggle alert' });
  }
};
