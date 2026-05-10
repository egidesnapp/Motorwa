import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        fullName: true,
        profilePhotoUrl: true,
        province: true,
        district: true,
        role: true,
        isPhoneVerified: true,
        isIdVerified: true,
        listingCount: true,
        averageRating: true,
        reviewCount: true,
        language: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, email, province, district, language } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(province && { province }),
        ...(district && { district }),
        ...(language && { language }),
      },
      select: {
        id: true,
        username: true,
        phone: true,
        email: true,
        fullName: true,
        profilePhotoUrl: true,
        province: true,
        district: true,
        role: true,
        isPhoneVerified: true,
        isIdVerified: true,
        language: true,
      },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { deletedAt: new Date() },
    });

    res.json({ success: true, data: { message: 'Account deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete account' });
  }
};

export const getMeStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [listingsCount, totalViews, messagesCount, savedCount] = await Promise.all([
      prisma.listing.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.listing.aggregate({
        where: { userId },
        _sum: { viewsCount: true },
      }),
      prisma.message.count({
        where: {
          conversation: {
            OR: [{ buyerId: userId }, { sellerId: userId }],
          },
        },
      }),
      prisma.savedListing.count({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        activeListings: listingsCount,
        totalViews: totalViews._sum.viewsCount || 0,
        messages: messagesCount,
        savedCars: savedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
};

export const getPublicProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        fullName: true,
        profilePhotoUrl: true,
        province: true,
        district: true,
        averageRating: true,
        reviewCount: true,
        isIdVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: req.params.id, isFlagged: false },
      include: {
        reviewer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
};

export const getUserListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.params.id, status: 'ACTIVE' },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
};
