import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { prisma } from '@motorwa/database';

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, isIdVerified: true, isBanned: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Account suspended' });
    }

    req.user = { ...payload, id: user.id };
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  });
};

export const requireDealer = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'DEALER' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Dealer access required' });
    }
    next();
  });
};

export const requireVerified = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (!req.user?.isVerified) {
      return res.status(403).json({ success: false, error: 'ID verification required' });
    }
    next();
  });
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const payload = verifyAccessToken(token);
      if (payload) {
        req.user = payload;
      }
    }
    next();
  } catch {
    next();
  }
};
