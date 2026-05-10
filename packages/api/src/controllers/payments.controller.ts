import { Response } from 'express';
import { prisma } from '@motorwa/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { initiateMtnPayment, checkMtnPaymentStatus, verifyMtnWebhook } from '../services/mtn.service';
import { initiateAirtelPayment, checkAirtelPaymentStatus, verifyAirtelWebhook } from '../services/airtel.service';

const PRICES: Record<string, number> = {
  'listing_boost_7d': 2000,
  'listing_boost_30d': 5000,
  'featured_listing_7d': 5000,
  'featured_listing_30d': 15000,
  'dealer_subscription_monthly': 50000,
  'dealer_subscription_annual': 500000,
  'inspection_fee': 10000,
};

export const initiatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { type, provider, itemKey, payerPhone, listingId } = req.body as {
      type: string;
      provider: 'MTN' | 'AIRTEL';
      itemKey: string;
      payerPhone: string;
      listingId?: string;
    };

    const amount = PRICES[itemKey];
    if (!amount) {
      return res.status(400).json({ success: false, error: 'Invalid payment item' });
    }

    // Replay prevention: check for existing pending payment
    const existing = await prisma.payment.findFirst({
      where: {
        userId: req.user!.id,
        type: type as any,
        status: 'PENDING',
        metadata: { path: ['itemKey'], equals: itemKey },
      },
    });

    if (existing) {
      return res.json({
        success: true,
        data: {
          paymentId: existing.id,
          reference: existing.providerReference,
          amount,
          status: 'PENDING',
        },
      });
    }

    const idempotencyKey = `${req.user!.id}-${itemKey}-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        type: type as any,
        amountRwf: amount,
        provider: provider as any,
        idempotencyKey,
        metadata: { itemKey, payerPhone, listingId },
      },
    });

    let reference: string;

    if (provider === 'MTN') {
      const result = await initiateMtnPayment({
        amount,
        payerPhone,
        paymentId: payment.id,
        description: `MotorWa.rw - ${itemKey.replace(/_/g, ' ')}`,
      });
      reference = result.reference;
    } else {
      const result = await initiateAirtelPayment({
        amount,
        phone: payerPhone,
        reference: payment.id,
        description: `MotorWa.rw - ${itemKey.replace(/_/g, ' ')}`,
      });
      reference = result.reference;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerReference: reference },
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        reference,
        amount,
        status: 'PENDING',
      },
    });
  } catch (error: any) {
    console.error('Payment initiation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to initiate payment' });
  }
};

export const mtnCallback = async (req: any, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!verifyMtnWebhook(payload, signature)) {
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }

    const { externalId, status } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: externalId } });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (status === 'SUCCESSFUL') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' },
      });
      await handlePaymentSuccess(payment);
    } else if (status === 'FAILED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', failureReason: 'MTN payment failed' },
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
};

export const airtelCallback = async (req: any, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const payload = JSON.stringify(req.body);

    if (!verifyAirtelWebhook(payload, signature)) {
      return res.status(401).json({ success: false, error: 'Invalid signature' });
    }

    const { reference, status } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (status === 'SUCCESSFUL') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' },
      });
      await handlePaymentSuccess(payment);
    } else if (status === 'FAILED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED', failureReason: 'Airtel payment failed' },
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment history' });
  }
};

export const getPayment = async (req: AuthRequest, res: Response) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch payment' });
  }
};

const handlePaymentSuccess = async (payment: any) => {
  const metadata = payment.metadata as any;
  const itemKey = metadata?.itemKey;
  const listingId = metadata?.listingId;

  if (!itemKey) return;

  if (itemKey.startsWith('listing_boost')) {
    const days = itemKey.includes('30d') ? 30 : 7;
    const where: any = { userId: payment.userId };
    if (listingId) where.id = listingId;
    await prisma.listing.updateMany({
      where,
      data: {
        isBoosted: true,
        boostedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });
  }

  if (itemKey.startsWith('featured_listing')) {
    const days = itemKey.includes('30d') ? 30 : 7;
    const where: any = { userId: payment.userId };
    if (listingId) where.id = listingId;
    await prisma.listing.updateMany({
      where,
      data: {
        isFeatured: true,
        featuredUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });
  }

  if (itemKey.startsWith('dealer_subscription')) {
    const isAnnual = itemKey.includes('annual');
    const expiryDays = isAnnual ? 365 : 30;

    const dealer = await prisma.dealer.findFirst({ where: { userId: payment.userId } });
    if (dealer) {
      await prisma.dealer.update({
        where: { id: dealer.id },
        data: {
          subscriptionPlan: isAnnual ? 'annual' : 'monthly',
          subscriptionStart: new Date(),
          subscriptionExpiry: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
};
