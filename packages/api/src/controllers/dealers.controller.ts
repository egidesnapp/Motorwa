import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDealers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, province } = req.query as any;

    const where: any = { isApproved: true };
    if (province) where.province = province;

    const [dealers, total] = await Promise.all([
      prisma.dealer.findMany({
        where,
        include: {
          user: { select: { id: true, fullName: true, averageRating: true, reviewCount: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.dealer.count({ where }),
    ]);

    res.json({
      success: true,
      data: dealers,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dealers' });
  }
};

export const getDealer = async (req: AuthRequest, res: Response) => {
  try {
    const dealer = await prisma.dealer.findFirst({
      where: {
        OR: [{ id: req.params.id }, { userId: req.params.id }],
        isApproved: true,
      },
      include: {
        user: { select: { id: true, fullName: true, averageRating: true, reviewCount: true } },
      },
    });

    if (!dealer) {
      return res.status(404).json({ success: false, error: 'Dealer not found' });
    }

    const listings = await prisma.listing.findMany({
      where: { userId: dealer.userId, status: 'ACTIVE' },
      include: { photos: { where: { isPrimary: true }, take: 1 } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: { ...dealer, listings } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dealer' });
  }
};

export const applyForDealer = async (req: AuthRequest, res: Response) => {
  try {
    const { businessName, description, address, district, province, websiteUrl } = req.body;

    const existing = await prisma.dealer.findUnique({ where: { userId: req.user!.id } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'You already have a dealer account' });
    }

    const dealer = await prisma.dealer.create({
      data: {
        userId: req.user!.id,
        businessName,
        description,
        address,
        district,
        province,
        websiteUrl,
      },
    });

    res.status(201).json({ success: true, data: dealer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to apply for dealer account' });
  }
};

export const updateDealer = async (req: AuthRequest, res: Response) => {
  try {
    const dealer = await prisma.dealer.findUnique({ where: { userId: req.user!.id } });
    if (!dealer) {
      return res.status(404).json({ success: false, error: 'Dealer profile not found' });
    }

    const { businessName, description, address, district, province, websiteUrl, operatingHours } = req.body;

    const updated = await prisma.dealer.update({
      where: { id: dealer.id },
      data: {
        ...(businessName && { businessName }),
        ...(description && { description }),
        ...(address && { address }),
        ...(district && { district }),
        ...(province && { province }),
        ...(websiteUrl && { websiteUrl }),
        ...(operatingHours && { operatingHours }),
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update dealer profile' });
  }
};

export const getDealerAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [totalViews, totalSaves, activeListings, totalMessages] = await Promise.all([
      prisma.listing.aggregate({ where: { userId }, _sum: { viewsCount: true } }),
      prisma.listing.aggregate({ where: { userId }, _sum: { savesCount: true } }),
      prisma.listing.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.conversation.count({ where: { sellerId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        totalViews: totalViews._sum.viewsCount || 0,
        totalSaves: totalSaves._sum.savesCount || 0,
        activeListings,
        totalMessages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
};
