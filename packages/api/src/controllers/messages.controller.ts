import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendMessageSchema } from '@motorwa/shared';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: userId, buyerArchived: false },
          { sellerId: userId, sellerArchived: false },
        ],
      },
      include: {
        listing: { select: { title: true, slug: true } },
        buyer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        seller: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        messages: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const enriched = conversations.map((conv) => ({
      ...conv,
      otherUser: conv.buyerId === userId ? conv.seller : conv.buyer,
      lastMessage: conv.messages[0] || null,
    }));

    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
  }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        OR: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
      },
      include: {
        listing: { select: { title: true, slug: true } },
        buyer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        seller: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        messages: { orderBy: { sentAt: 'asc' } },
      },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    await prisma.message.updateMany({
      where: { conversationId: req.params.id, senderId: { not: req.user!.id }, isRead: false },
      data: { isRead: true },
    });

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conversation' });
  }
};

export const startConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.body as { listingId: string };

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { userId: true },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    if (listing.userId === req.user!.id) {
      return res.status(400).json({ success: false, error: 'Cannot message yourself' });
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        listingId_buyerId: { listingId, buyerId: req.user!.id },
      },
      create: {
        listingId,
        buyerId: req.user!.id,
        sellerId: listing.userId,
      },
      update: {},
      include: {
        listing: { select: { title: true, slug: true } },
        seller: { select: { id: true, fullName: true } },
      },
    });

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start conversation' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const data = sendMessageSchema.parse(req.body);

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: req.params.id,
        OR: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
      },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: req.user!.id,
        content: data.content,
        photoUrls: data.photoUrls || [],
      },
    });

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessageAt: new Date() },
    });

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.message.updateMany({
      where: {
        conversationId: req.params.id,
        senderId: { not: req.user!.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ success: true, data: { message: 'Messages marked as read' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark messages as read' });
  }
};

export const archiveConversation = async (req: AuthRequest, res: Response) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: req.params.id },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    const isBuyer = conversation.buyerId === req.user!.id;

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: isBuyer ? { buyerArchived: true } : { sellerArchived: true },
    });

    res.json({ success: true, data: { message: 'Conversation archived' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to archive conversation' });
  }
};
