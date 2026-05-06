import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query as any;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.notification.count({ where: { userId: req.user!.id } }),
    ]);

    res.json({
      success: true,
      data: notifications,
      meta: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, isRead: false },
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user!.id },
      data: { isRead: true },
    });

    res.json({ success: true, data: { message: 'Notification marked as read' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true, data: { message: 'All notifications marked as read' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark all as read' });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.deleteMany({
      where: { id: req.params.id, userId: req.user!.id },
    });

    res.json({ success: true, data: { message: 'Notification deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
};
