import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const reportListing = async (req: AuthRequest, res: Response) => {
  try {
    const { reason, details } = req.body as { reason: string; details?: string };

    const report = await prisma.report.create({
      data: {
        reporterId: req.user!.id,
        reportedListingId: req.params.id,
        reason,
        details,
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to report listing' });
  }
};

export const reportConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { reason, details } = req.body as { reason: string; details?: string };

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        OR: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
      },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const reportedUserId = conversation.buyerId === req.user!.id ? conversation.sellerId : conversation.buyerId;

    const report = await prisma.report.create({
      data: {
        reporterId: req.user!.id,
        reportedUserId,
        reason,
        details,
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to report conversation' });
  }
};
