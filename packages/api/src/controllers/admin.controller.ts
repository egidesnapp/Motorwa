import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [usersToday, listingsToday, activeListings, totalUsers, totalRevenue] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.listing.count({ where: { createdAt: { gte: today } } }),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count(),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amountRwf: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        usersToday,
        listingsToday,
        activeListings,
        totalUsers,
        totalRevenue: totalRevenue._sum.amountRwf || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard' });
  }
};

export const getListings = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status, province } = req.query as any;

    const where: any = {};
    if (status) where.status = status;
    if (province) where.province = province;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, fullName: true, phone: true } },
          photos: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      success: true,
      data: listings,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
};

export const approveListing = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.listing.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.id,
        action: 'LISTING_APPROVED',
        targetType: 'Listing',
        targetId: req.params.id,
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: { message: 'Listing approved' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to approve listing' });
  }
};

export const rejectListing = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body as { reason: string };

    await prisma.listing.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED', rejectionReason: reason },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.id,
        action: 'LISTING_REJECTED',
        targetType: 'Listing',
        targetId: req.params.id,
        details: { reason },
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: { message: 'Listing rejected' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reject listing' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, search, role, banned } = req.query as any;

    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    if (banned === 'true') where.isBanned = true;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
          select: {
            id: true, username: true, fullName: true, phone: true, email: true, role: true,
            isIdVerified: true, isBanned: true, listingCount: true, createdAt: true,
          },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      meta: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

export const banUser = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body as { reason: string };

    await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: true, banReason: reason },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.id,
        action: 'USER_BANNED',
        targetType: 'User',
        targetId: req.params.id,
        details: { reason },
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: { message: 'User banned' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to ban user' });
  }
};

export const unbanUser = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: false, banReason: null },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.id,
        action: 'USER_UNBANNED',
        targetType: 'User',
        targetId: req.params.id,
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: { message: 'User unbanned' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unban user' });
  }
};

export const verifyUserId = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isIdVerified: true },
    });

    res.json({ success: true, data: { message: 'User ID verified' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify user ID' });
  }
};

export const approveDealer = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.dealer.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });

    await prisma.user.update({
      where: { id: (await prisma.dealer.findUnique({ where: { id: req.params.id } }))!.userId },
      data: { role: 'DEALER' },
    });

    res.json({ success: true, data: { message: 'Dealer approved' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to approve dealer' });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query as any;

    const where: any = {};
    if (status) where.status = status;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, fullName: true } },
          reportedUser: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      success: true,
      data: reports,
      meta: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { adminNotes } = req.body as { adminNotes: string };

    await prisma.report.update({
      where: { id: req.params.id },
      data: { status: 'RESOLVED', adminNotes, resolvedAt: new Date() },
    });

    res.json({ success: true, data: { message: 'Report resolved' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to resolve report' });
  }
};

export const getLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 50 } = req.query as any;

    const logs = await prisma.adminLog.findMany({
      include: {
        admin: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch logs' });
  }
};
