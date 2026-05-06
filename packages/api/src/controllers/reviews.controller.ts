import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { createReviewSchema } from '@motorwa/shared';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const data = createReviewSchema.parse(req.body);

    const review = await prisma.review.create({
      data: {
        reviewerId: req.user!.id,
        reviewedUserId: data.reviewedUserId,
        listingId: data.listingId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        reviewer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
      },
    });

    await prisma.user.update({
      where: { id: data.reviewedUserId },
      data: { reviewCount: { increment: 1 } },
    });

    const avgRating = await prisma.review.aggregate({
      where: { reviewedUserId: data.reviewedUserId, isFlagged: false },
      _avg: { rating: true },
    });

    await prisma.user.update({
      where: { id: data.reviewedUserId },
      data: { averageRating: avgRating._avg.rating || 0 },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create review' });
  }
};

export const respondToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { response } = req.body as { response: string };

    const review = await prisma.review.findFirst({
      where: {
        id: req.params.id,
        reviewedUserId: req.user!.id,
      },
    });

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data: { sellerResponse: response },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to respond to review' });
  }
};

export const flagReview = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.review.update({
      where: { id: req.params.id },
      data: { isFlagged: true },
    });

    res.json({ success: true, data: { message: 'Review flagged for moderation' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to flag review' });
  }
};

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId: req.params.userId, isFlagged: false },
      include: {
        reviewer: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        listing: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
};
