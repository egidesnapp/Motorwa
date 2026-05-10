import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { createListingSchema, updateListingSchema, searchParamsSchema } from '@motorwa/shared';
import { sanitizeHtml } from '../utils/sanitize';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
};

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const data = createListingSchema.parse(req.body);

    const title = sanitizeHtml(`${data.year} ${data.make} ${data.model}`);
    const slug = generateSlug(title);

    const listing = await prisma.listing.create({
      data: {
        ...data,
        title,
        slug,
        description: sanitizeHtml(data.description),
        userId: req.user!.id,
        priceRwf: BigInt(data.priceRwf),
      },
    });

    await prisma.user.update({
      where: { id: req.user!.id },
      data: { listingCount: { increment: 1 } },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create listing' });
  }
};

export const getListings = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = searchParamsSchema.parse(req.query);

    const { q, make, model, year_min, year_max, price_min, price_max, fuel_type, transmission, condition, province, seller_type, import_origin, sort, page, limit } = parsed;

    const where: any = { status: 'ACTIVE', deletedAt: null };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { make: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (make) where.make = make;
    if (model) where.model = model;
    if (year_min || year_max) {
      where.year = {};
      if (year_min) where.year.gte = year_min;
      if (year_max) where.year.lte = year_max;
    }
    if (price_min || price_max) {
      where.priceRwf = {};
      if (price_min) where.priceRwf.gte = BigInt(price_min);
      if (price_max) where.priceRwf.lte = BigInt(price_max);
    }
    if (fuel_type) where.fuelType = fuel_type;
    if (transmission) where.transmission = transmission;
    if (condition) where.condition = condition;
    if (province) where.province = province;
    if (import_origin) where.importOrigin = import_origin;

    let orderBy: any = {};
    switch (sort) {
      case 'price_low':
        orderBy = { priceRwf: 'asc' };
        break;
      case 'price_high':
        orderBy = { priceRwf: 'desc' };
        break;
      case 'most_viewed':
        orderBy = { viewsCount: 'desc' };
        break;
      default:
        orderBy = { isFeatured: 'desc', isBoosted: 'desc', createdAt: 'desc' };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          user: { select: { id: true, fullName: true, isIdVerified: true, averageRating: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      success: true,
      data: listings,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
};

export const getListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [{ id: req.params.id }, { slug: req.params.id }],
        status: { not: 'DRAFT' },
        deletedAt: null,
      },
      include: {
        photos: { orderBy: { displayOrder: 'asc' } },
        specs: true,
        user: { select: { id: true, fullName: true, profilePhotoUrl: true, isIdVerified: true, averageRating: true, reviewCount: true, createdAt: true } },
        priceHistory: { orderBy: { changedAt: 'desc' }, take: 10 },
      },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    await prisma.listing.update({
      where: { id: listing.id },
      data: { viewsCount: { increment: 1 } },
    });

    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listing' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const data = updateListingSchema.parse(req.body);

    if (data.priceRwf && data.priceRwf !== Number(listing.priceRwf)) {
      await prisma.priceHistory.create({
        data: {
          listingId: listing.id,
          oldPrice: listing.priceRwf,
          newPrice: BigInt(data.priceRwf),
        },
      });
    }

    const sanitized = {
      ...data,
      ...(data.description && { description: sanitizeHtml(data.description) }),
      ...(data.priceRwf && { priceRwf: BigInt(data.priceRwf) }),
    };

    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: sanitized,
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to update listing' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    await prisma.listing.update({
      where: { id: listing.id },
      data: { deletedAt: new Date(), status: 'EXPIRED' },
    });

    res.json({ success: true, data: { message: 'Listing deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete listing' });
  }
};

export const getFeaturedListings = async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();

    const listings = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          { isFeatured: true, featuredUntil: { gt: now } },
          { isBoosted: true, boostedUntil: { gt: now } },
        ],
      },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, fullName: true, isIdVerified: true } },
      },
      orderBy: { isFeatured: 'desc' },
      take: 12,
    });

    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch featured listings' });
  }
};

export const revealPhone = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { phone: true } } },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    if (req.user!.id === listing.userId) {
      return res.status(400).json({ success: false, error: 'Cannot reveal your own phone' });
    }

    const existing = await prisma.phoneReveal.findFirst({
      where: { revealedBy: req.user!.id, listingId: listing.id },
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Phone already revealed' });
    }

    await prisma.phoneReveal.create({
      data: {
        revealedBy: req.user!.id,
        revealedOf: listing.userId,
        listingId: listing.id,
        ipAddress: req.ip,
      },
    });

    res.json({ success: true, data: { phone: listing.user.phone } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reveal phone' });
  }
};

export const updateListingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const { status } = req.body as { status: string };
    const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'SOLD', 'EXPIRED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: { status: status as any, ...(status === 'SOLD' && { soldAt: new Date() }) },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update listing status' });
  }
};

export const boostListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({
      success: true,
      data: {
        message: 'Initiate payment to boost listing',
        itemKey: 'listing_boost_7d',
        amount: 2000,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to boost listing' });
  }
};

export const featureListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    res.json({
      success: true,
      data: {
        message: 'Initiate payment to feature listing',
        itemKey: 'featured_listing_7d',
        amount: 5000,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to feature listing' });
  }
};

export const getListingStats = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findFirst({
      where: { id: req.params.id, userId: req.user!.id, deletedAt: null },
      select: { viewsCount: true, savesCount: true },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const messagesCount = await prisma.conversation.count({
      where: { listingId: req.params.id },
    });

    res.json({
      success: true,
      data: {
        views: listing.viewsCount,
        saves: listing.savesCount,
        messages: messagesCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch listing stats' });
  }
};

export const getSimilarListings = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      select: { make: true, model: true, year: true, province: true, priceRwf: true },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const similar = await prisma.listing.findMany({
      where: {
        id: { not: req.params.id },
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          { make: listing.make },
          { model: listing.model },
        ],
      },
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        user: { select: { id: true, fullName: true, isIdVerified: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    res.json({ success: true, data: similar });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch similar listings' });
  }
};

export const getPriceHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await prisma.priceHistory.findMany({
      where: { listingId: req.params.id },
      orderBy: { changedAt: 'asc' },
    });

    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch price history' });
  }
};
